import { NextRequest, NextResponse } from 'next/server';
import { AlertSystem } from '@/lib/content/AlertSystem';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const ruleId = searchParams.get('ruleId');
    
    const contentDir = path.join(process.cwd(), 'src/content');
    const alertSystem = new AlertSystem(contentDir);
    
    switch (action) {
      case 'rules':
        // Get alert rules configuration
        const rules = alertSystem.getAlertRules();
        return NextResponse.json(rules);
        
      case 'run-all':
        // Run all alert rules
        const allAlerts = await alertSystem.runAllAlerts();
        return NextResponse.json(allAlerts);
        
      case 'run-rule':
        // Run specific alert rule
        if (!ruleId) {
          return NextResponse.json(
            { error: 'ruleId parameter required for run-rule action' },
            { status: 400 }
          );
        }
        const ruleAlerts = await alertSystem.runAlertRule(ruleId);
        return NextResponse.json(ruleAlerts);
        
      default:
        // Default: return current alerts (same as run-all)
        const currentAlerts = await alertSystem.runAllAlerts();
        return NextResponse.json(currentAlerts);
    }
  } catch (error) {
    console.error('Error in alert system:', error);
    return NextResponse.json(
      { error: 'Failed to process alert system request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ruleId, ruleUpdates, newRule } = body;
    
    const contentDir = path.join(process.cwd(), 'src/content');
    const alertSystem = new AlertSystem(contentDir);
    
    switch (action) {
      case 'update-rule':
        if (!ruleId || !ruleUpdates) {
          return NextResponse.json(
            { error: 'ruleId and ruleUpdates required for update-rule action' },
            { status: 400 }
          );
        }
        
        const updateSuccess = alertSystem.updateAlertRule(ruleId, ruleUpdates);
        if (!updateSuccess) {
          return NextResponse.json(
            { error: 'Alert rule not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({ success: true, message: 'Alert rule updated' });
        
      case 'add-rule':
        if (!newRule) {
          return NextResponse.json(
            { error: 'newRule required for add-rule action' },
            { status: 400 }
          );
        }
        
        alertSystem.addAlertRule(newRule);
        return NextResponse.json({ success: true, message: 'Alert rule added' });
        
      case 'remove-rule':
        if (!ruleId) {
          return NextResponse.json(
            { error: 'ruleId required for remove-rule action' },
            { status: 400 }
          );
        }
        
        const removeSuccess = alertSystem.removeAlertRule(ruleId);
        if (!removeSuccess) {
          return NextResponse.json(
            { error: 'Alert rule not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({ success: true, message: 'Alert rule removed' });
        
      case 'run-alerts':
        // Manually trigger alert generation
        const alerts = await alertSystem.runAllAlerts();
        return NextResponse.json({
          success: true,
          message: 'Alerts generated',
          alerts,
          count: alerts.length
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in alert system POST:', error);
    return NextResponse.json(
      { error: 'Failed to process alert system request' },
      { status: 500 }
    );
  }
}