import React from 'react'
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io5";
import { IoLogoGithub } from "react-icons/io5";
import {Link} from "react-router-dom"
const Footer = () => {
  return (
      <div className="bg-black text-[#fafafa] p-6 md:p-8">
      
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Company Logo/Name */}
        <div className="flex-shrink-0">
          <h3 className="text-2xl font-bold tracking-wider ">RepoScout</h3>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-8 font-medium">
          <Link >Privacy</Link>
          <Link >Terms</Link>
          <Link >Contact</Link>
        </nav>

        {/* Social Media Icons */}
        <div className="flex items-center gap-4 text-gray-300">
          {/* Twitter Icon */}
          <Link>
            <FaXTwitter className='text-xl' />
          </Link>
          {/* LinkedIn Icon */}
          <Link >
<IoLogoLinkedin  className='text-xl'/>
          </Link>
          {/* Github Icon (Added for more options) */}
          <Link >
      <IoLogoGithub className='text-2xl' />

          </Link>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-100">
        © 2025 RepoScout All rights reserved.
      </div>
    </div>

  )
}

export default Footer