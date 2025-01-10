import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { MainNav } from '@/components/main-nav'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prismadb from '@/prisma/prismadb'
import StoreSwitcher from './store-switcher'
import { ThemeToggle } from './theme-toggle'

const navbar = async () => {
    const authData = await auth();
    const { userId } = authData;

    if (!userId) {
        redirect('/sign-in');
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId,
        },
    });

  return (
    <div className='border-b dark:border-none dark:bg-none'>
      <div className='flex justify-between h-16 items-center px-4'>
        <div>
          <StoreSwitcher items={stores}/>
        </div>

        {/* Centrer MainNav */}
        <div className='flex-grow flex justify-center'>
          <MainNav className='mx-6'/>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeToggle/>
          <UserButton afterSignOutUrl="/"/> {/* If I logout i'll be directed to the main page */}
        </div>
      </div>
    </div>
  )
}

export default navbar;
