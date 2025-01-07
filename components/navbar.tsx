
import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { MainNav } from '@/components/main-nav'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/dist/server/api-utils'
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
    <div className='border-b bg-[#081c37]'>
      <div className='flex h-16 items-center px-4'>
        <StoreSwitcher items={stores}/>
        <MainNav className='mx-6'/>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeToggle/>
          <UserButton afterSignOutUrl="/"/> {/* If I logout i'll be directed to the main page */}
        </div>
      </div>
    </div>
  )
}

export default navbar