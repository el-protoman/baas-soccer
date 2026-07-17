import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { virtual_account_id, direction, type, amount, description } = await req.json();

    if (!virtual_account_id || !direction || !type || !amount) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const numericAmount = Number(amount);
    if (!(numericAmount > 0)) {
      return Response.json({ error: 'Amount must be greater than zero' }, { status: 400 });
    }

    const account = await base44.entities.VirtualAccount.get(virtual_account_id);
    if (!account) {
      return Response.json({ error: 'Virtual account not found' }, { status: 404 });
    }

    const currentBalance = account.balance || 0;

    if (direction === 'Debit' && currentBalance < numericAmount) {
      return Response.json({ error: 'Insufficient balance for this debit' }, { status: 400 });
    }

    const newBalance = direction === 'Credit' ? currentBalance + numericAmount : currentBalance - numericAmount;

    await base44.entities.VirtualAccount.update(virtual_account_id, { balance: newBalance });

    const ledgerEntry = await base44.entities.TransactionLedger.create({
      virtual_account_id,
      direction,
      type,
      amount: numericAmount,
      description: description || '',
      timestamp: new Date().toISOString(),
    });

    return Response.json({ success: true, ledgerEntry, newBalance });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});