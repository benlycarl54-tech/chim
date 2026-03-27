import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { transaction_type, amount, account_number, recipient } = await req.json();

        const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #25D366; padding: 30px; text-align: center; }
        .logo { width: 120px; height: auto; }
        .content { padding: 30px; }
        .alert-box { background-color: #e8f5e9; border-left: 4px solid #25D366; padding: 15px; margin: 20px 0; }
        .transaction-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
        .detail-label { font-weight: bold; color: #666; }
        .detail-value { color: #333; }
        .amount { font-size: 24px; font-weight: bold; color: #d32f2f; }
        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header" style="background-color: #25D366;">
            <svg viewBox="0 0 200 50" style="width: 120px; height: auto;" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <text x="10" y="35" font-family="Arial, sans-serif" font-size="32" font-weight="600" fill="#ffffff" letter-spacing="-1">chime</text>
                    <circle cx="180" cy="20" r="3" fill="#ffffff"/>
                </svg>
        </div>
        
        <div class="content">
            <h2 style="color: #25D366; margin-top: 0;">Debit Alert Notification</h2>
            
            <div class="alert-box">
                <strong>⚠️ Account Debited</strong>
                <p style="margin: 5px 0 0 0;">A debit transaction has been processed on your account.</p>
            </div>
            
            <div class="transaction-details">
                <div class="detail-row">
                    <span class="detail-label">Transaction Type:</span>
                    <span class="detail-value">${transaction_type}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Amount:</span>
                    <span class="amount">-$${amount.toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">From Account:</span>
                    <span class="detail-value">${account_number}</span>
                </div>
                ${recipient ? `
                <div class="detail-row">
                    <span class="detail-label">To:</span>
                    <span class="detail-value">${recipient}</span>
                </div>
                ` : ''}
                <div class="detail-row" style="border-bottom: none;">
                    <span class="detail-label">Date & Time:</span>
                    <span class="detail-value">${new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
            </div>
            
            <p style="color: #666; font-size: 14px;">
                If you did not authorize this transaction, please contact our fraud team immediately.
            </p>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from Chime Banking.</p>
            <p>Please do not reply to this email.</p>
            <p style="margin-top: 15px; color: #999;">© ${new Date().getFullYear()} Chime. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `;

        await base44.integrations.Core.SendEmail({
            to: user.email,
            subject: `Chime Debit Alert - $${amount.toFixed(2)} Debited`,
            body: emailBody,
            from_name: "Chime Banking"
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});