"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
const Header = () => {

    const path = usePathname(); // return the current path 
    useEffect(() =>{
        console.log(path)
    }, [])
    return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
      <Image src={'/logo.svg'} width={60} height={50} alt=''/>
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-pink-600 hover:font-bold transition-all cursor-pointer ${path == '/dashboard' && 'text-pink-600 font-bold'}`}>Dashboard</li>
        <li className={`hover:text-pink-600 hover:font-bold transition-all cursor-pointer ${path == '/dashboard/questions' && 'text-pink-600 font-bold'}`}>Questions</li>
        <li className={`hover:text-pink-600 hover:font-bold transition-all cursor-pointer ${path == '/dashboard/upgrade' && 'text-pink-600 font-bold'}`}>Upgrade</li>
        <li className={`hover:text-pink-600 hover:font-bold transition-all cursor-pointer ${path == '/dashboard/how' && 'text-pink-600 font-bold'}`}>How it works?</li>
      </ul>
      <UserButton/>
    </div>
  )
}

export default Header
