"use client"
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUser, useClerk } from '@clerk/nextjs'

export default function ProfileModal({ open, onOpenChange }) {
    const { user } = useUser();
    const clerk = useClerk();

    if (!user) return null;

    const primaryEmail = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? '';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Profile</DialogTitle>
                </DialogHeader>

                <div className='p-2'>
                    <p className='font-semibold'>Name</p>
                    <p className='mb-2'>{user.fullName ?? '—'}</p>

                    <p className='font-semibold'>Email</p>
                    <p className='mb-2'>{primaryEmail}</p>

                    <p className='font-semibold'>Plan</p>
                    <p className='mb-2'>{user?.publicMetadata?.plan ?? 'Free'}</p>

                </div>
                <DialogFooter>
                    <Button variant={'ghost'} onClick={() => clerk.signOut()}>Sign out</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
