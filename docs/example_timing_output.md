# Example Timing Output for AI Model Performance Analysis

## Summary.md Example

```markdown
# AI Analysis Summary

**Generated:** 2024-01-15T10:30:45.123456+00:00
**Submission ID:** sub_1234567890
**Model Used:** google/gemini-2.0-flash-exp:free
**Tokens Used:** 1,250
**Processing Time:** 3.45 seconds

## Summary

[AI-generated summary content here...]

## Performance Analysis

This analysis was completed using AI models with the following performance characteristics:

- **Model Performance:** google/gemini-2.0-flash-exp:free
- **Total Processing Time:** 3.45 seconds
- **Token Efficiency:** 1,250 tokens used
- **Cost per Token:** Available in individual agent result files

*For detailed performance metrics of each agent, see the individual result files (nlp.md, voicerecording.md, attachments.md, prototype.md).*
```

## Individual Agent Result Files

### nlp.md Example

```markdown
# NLP Agent Results

**Generated:** 2024-01-15T10:30:42.123456+00:00
**Submission ID:** sub_1234567890
**Agent Type:** nlp
**Model Used:** google/gemini-2.0-flash-exp:free
**Tokens Used:** 450
**Processing Time:** 1.23 seconds

## Results

[Detailed NLP analysis results...]
```

### voicerecording.md Example

```markdown
# ASR Agent Results

**Generated:** 2024-01-15T10:30:43.123456+00:00
**Submission ID:** sub_1234567890
**Agent Type:** asr
**Model Used:** whisper-1
**Tokens Used:** 0
**Processing Time:** 0.89 seconds

## Results

[ASR transcription results...]
```

### attachments.md Example

```markdown
# DOCUMENT Agent Results

**Generated:** 2024-01-15T10:30:44.123456+00:00
**Submission ID:** sub_1234567890
**Agent Type:** document
**Model Used:** google/gemini-2.0-flash-exp:free
**Tokens Used:** 800
**Processing Time:** 1.33 seconds

## Results

[Document analysis results...]
```

### prototype.md Example

```markdown
# PROTOTYPE Agent Results

**Generated:** 2024-01-15T10:30:45.123456+00:00
**Submission ID:** sub_1234567890
**Agent Type:** prototype
**Model Used:** google/gemini-2.0-flash-exp:free
**Tokens Used:** 1,200
**Processing Time:** 2.15 seconds

## Results

[Prototype generation results...]
```

## Performance Comparison Benefits

With this timing information, you can:

1. **Identify Fastest Models**: Compare processing times across different AI models
2. **Optimize Token Usage**: Track which models are most token-efficient
3. **Cost Analysis**: Calculate cost per second and cost per token
4. **Performance Bottlenecks**: Identify which agents take the longest
5. **Model Selection**: Choose the fastest models for production use
6. **Scaling Decisions**: Understand resource requirements for different models

## Model Performance Metrics

| Model | Agent Type | Processing Time | Tokens Used | Speed (tokens/sec) |
|-------|------------|----------------|-------------|-------------------|
| google/gemini-2.0-flash-exp:free | NLP | 1.23s | 450 | 366 |
| google/gemini-2.0-flash-exp:free | Document | 1.33s | 800 | 602 |
| google/gemini-2.0-flash-exp:free | Prototype | 2.15s | 1,200 | 558 |
| whisper-1 | ASR | 0.89s | 0 | N/A |

This data helps you make informed decisions about which models to use for optimal performance and cost efficiency.
