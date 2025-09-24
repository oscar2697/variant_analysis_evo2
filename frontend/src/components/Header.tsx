import React from 'react'

const Header = () => {
    return (
        <header className="border-b border-[#3c4f3d]/10 bg-white">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <h1 className="text-xl font-light tracking-wide text-[#3c4f3d]">
                            <span className="font-normal">Evo</span>
                            <span className="text-[#de8246]">2</span>
                        </h1>

                        <div className="absolute -bottom-1 lef-0 h-[2px] w-12 bg-[#de8246]"></div>
                    </div>

                    <span className="text-sm font-light text-[#3c4f3d]/70">Variant Analysis</span>
                </div>
            </div>
        </header>
    )
}

export default Header
