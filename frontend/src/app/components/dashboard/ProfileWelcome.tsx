"use client"

import { Icon } from "@iconify/react"

const ProfileWelcome = () => {
    return (
        <div className="relative flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                    <Icon icon="solar:user-bold" height={28} width={28} className="text-white" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <h5 className="card-title text-xl">Welcome to PRICE Dashboard</h5>
                    <p className="text-link/80 dark:text-white/80">Pain Research and Intervention Center of Excellence</p>
                </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-success/10 px-4 py-2 rounded-lg">
                <Icon icon="solar:shield-check-bold" height={24} width={24} className="text-success" />
                <div>
                    <p className="text-success font-medium text-sm">Limited Data Set</p>
                    <p className="text-success/70 text-xs">HIPAA Compliant</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileWelcome
