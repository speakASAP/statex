'use client';

import React, { useState, useEffect } from 'react';

interface ContentBlock {
  id: string;
  level: number;
  title: string;
  content: string;
  children: ContentBlock[];
}

interface CollapsibleContentProps {
  htmlContent: string | any;
  defaultCollapsed?: boolean;
  articleTitle?: string;
}

export function CollapsibleContent({ 
  htmlContent, 
  defaultCollapsed = false, 
  articleTitle = 'Article Content' 
}: CollapsibleContentProps) {
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set());
  const [parsedBlocks, setParsedBlocks] = useState<ContentBlock[]>([]);

  // Parse HTML content into structured blocks based on headings
  useEffect(() => {
    // Handle different content types
    let contentToParse = '';
    if (typeof htmlContent === 'string') {
      contentToParse = htmlContent;
    } else if (htmlContent && typeof htmlContent === 'object') {
      // If it's an object, try to extract HTML content
      if (htmlContent.html) {
        contentToParse = htmlContent.html;
      } else if (htmlContent.content && htmlContent.content.html) {
        contentToParse = htmlContent.content.html;
      } else {
        // Fallback: stringify the object
        contentToParse = JSON.stringify(htmlContent);
      }
    } else {
      contentToParse = String(htmlContent);
    }
    
    // Parse HTML content to extract headings and create nested structure
    const blocks = parseHTMLContent(contentToParse, articleTitle);
    setParsedBlocks(blocks);
    
    // Set initial collapsed state - all blocks expanded by default
    if (defaultCollapsed) {
      const collapsedIds = new Set(blocks.map(block => block.id));
      setCollapsedBlocks(collapsedIds);
    }
  }, [htmlContent, defaultCollapsed, articleTitle]);

  // Parse HTML content and create nested content blocks
  const parseHTMLContent = (html: string, title: string): ContentBlock[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find all headings (h2-h5) and their content
    const headings = Array.from(doc.querySelectorAll('h2, h3, h4, h5'));
    
    if (headings.length === 0) {
      // No headings found, create a single block with all content
      return [{
        id: 'content-block-1',
        level: 0,
        title: title,
        content: html,
        children: []
      }];
    }

    const blocks: ContentBlock[] = [];
    let blockCounter = 1;

    // Process each heading and its content
    headings.forEach((heading) => {
      const headingLevel = parseInt(heading.tagName.charAt(1)) - 2; // h2=0, h3=1, h4=2, h5=3
      const headingText = heading.textContent || '';
      const blockId = `content-block-${blockCounter++}`;

      // Create new block
      const newBlock: ContentBlock = {
        id: blockId,
        level: headingLevel,
        title: headingText,
        content: '',
        children: []
      };

      // Extract content between this heading and the next heading
      let content = '';
      let nextElement = heading.nextElementSibling;
      
      while (nextElement && !['H2', 'H3', 'H4', 'H5'].includes(nextElement.tagName)) {
        content += nextElement.outerHTML;
        nextElement = nextElement.nextElementSibling;
      }

      newBlock.content = content;

      // Add to appropriate parent based on heading level
      if (headingLevel === 0) {
        // Top level heading (h2)
        blocks.push(newBlock);
      } else {
        // Nested heading (h3, h4, h5)
        // Find the appropriate parent based on heading level
        let parent = findParentBlock(blocks, headingLevel);
        if (parent) {
          parent.children.push(newBlock);
        } else {
          // Fallback: add to top level
          blocks.push(newBlock);
        }
      }
    });

    return blocks;
  };

  // Find the appropriate parent block for a given heading level
  const findParentBlock = (blocks: ContentBlock[], targetLevel: number): ContentBlock | null => {
    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i];
      if (block && block.level < targetLevel) {
        return block;
      }
      // Check children recursively
      if (block) {
        const childParent = findParentBlock(block.children, targetLevel);
        if (childParent) {
          return childParent;
        }
      }
    }
    return null;
  };

  const toggleBlock = (blockId: string) => {
    setCollapsedBlocks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blockId)) {
        newSet.delete(blockId);
      } else {
        newSet.add(blockId);
      }
      return newSet;
    });
  };

  const renderBlock = (block: ContentBlock, depth: number = 0): React.ReactNode => {
    const isCollapsed = collapsedBlocks.has(block.id);
    // Map heading levels: level 0 = h2, level 1 = h3, level 2 = h4, level 3 = h5
    const headingTag = `h${Math.min(block.level + 2, 6)}` as keyof JSX.IntrinsicElements;
    
    return (
      <div 
        key={block.id} 
        className={`stx-content-block stx-content-block--level-${block.level}`}
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div 
          className="stx-content-block__header"
          onClick={() => toggleBlock(block.id)}
          role="button"
          tabIndex={0}
          aria-expanded={!isCollapsed}
          aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${block.title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleBlock(block.id);
            }
          }}
        >
          <span className={`stx-content-block__toggle-icon ${isCollapsed ? 'stx-content-block__toggle-icon--collapsed' : ''}`}>
            ▼
          </span>
          {React.createElement(headingTag, {
            className: 'stx-content-block__title'
          }, block.title)}
        </div>
        
        <div 
          className={`stx-content-block__content ${isCollapsed ? 'stx-content-block__content--collapsed' : ''}`}
        >
          {block.content && (
            <div 
              className="stx-content-block__text"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          )}
          
          {block.children.length > 0 && (
            <div className="stx-content-block__children">
              {block.children.map(child => renderBlock(child, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="stx-collapsible-content">
      <div className="stx-collapsible-content__container">
        {parsedBlocks.length > 0 ? (
          parsedBlocks.map((block) => renderBlock(block))
        ) : (
          <div className="stx-content-block stx-content-block--level-0">
            <div 
              className="stx-content-block__header"
              onClick={() => toggleBlock('fallback')}
              role="button"
              tabIndex={0}
              aria-expanded={!collapsedBlocks.has('fallback')}
              aria-label={`${collapsedBlocks.has('fallback') ? 'Expand' : 'Collapse'} ${articleTitle}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleBlock('fallback');
                }
              }}
            >
              <span className={`stx-content-block__toggle-icon ${collapsedBlocks.has('fallback') ? 'stx-content-block__toggle-icon--collapsed' : ''}`}>
                ▼
              </span>
              <h2 className="stx-content-block__title">{articleTitle}</h2>
            </div>
            <div 
              className={`stx-content-block__content ${collapsedBlocks.has('fallback') ? 'stx-content-block__content--collapsed' : ''}`}
            >
              <div dangerouslySetInnerHTML={{ __html: typeof htmlContent === 'string' ? htmlContent : JSON.stringify(htmlContent) }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 