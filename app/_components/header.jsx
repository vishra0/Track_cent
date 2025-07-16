"use client";
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { UserButton, useUser,  } from '@clerk/nextjs'
import Link from 'next/link';

function header() {
  const {user, isSignedIn} = useUser();
  return (
    <div className='p-5 flex justify-between items-center border shadow-md'>
    <div className='flex items-center text-primary font-bold'>
    <Image src={'./logo.svg'}
    alt='logo'
    width={100}
    height={100}
    />
    <h1>Track Cent</h1>
    </div>
   {isSignedIn? <UserButton/> : <Link href={'/sign-in'}><Button>Sign In</Button></Link>}
    
    </div>

  )
}

export default header