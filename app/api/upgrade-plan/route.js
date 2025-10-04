import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body?.email;
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

    // find user by email
    const users = await clerkClient.users.getUserList({ emailAddress: [email] });
    if (!users || users.length === 0) return NextResponse.json({ error: 'user not found' }, { status: 404 });

    const user = users[0];

    // update public metadata
    await clerkClient.users.updateUser(user.id, { publicMetadata: { ...(user.publicMetadata || {}), plan: 'unlimited_plan' } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Upgrade API error', err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
