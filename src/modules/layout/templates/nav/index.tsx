import { Suspense } from "react"
import Image from "next/image"

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

const MainNavItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/store" },
  { name: "Account", href: "/account" },
  { name: "Cart", href: "/cart" },
]

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          {/* Logo on the left */}
          <div className="flex-1 basis-0 h-full flex items-center">
            <LocalizedClientLink
              href="/"
              className="relative h-12 w-36 flex items-center"
              data-testid="nav-logo-link"
            >
              <Image
                src="/logos/logo-60.webp"
                alt="Autoglym Logo"
                fill
                className="object-contain"
                priority
              />
            </LocalizedClientLink>
          </div>

          {/* Main Navigation Links - hidden on mobile */}
          <div className="hidden small:flex items-center justify-center gap-6 h-full">
            {MainNavItems.map((item) => (
              <div key={item.name} className="relative h-full flex items-center">
                <LocalizedClientLink
                  href={item.href}
                  className="txt-medium hover:text-ui-fg-base flex items-center h-full px-2 transition-colors relative"
                  data-testid={`nav-${item.name.toLowerCase()}-link`}
                >
                  {item.name}
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black scale-x-0 hover:scale-x-100 transition-transform duration-200 origin-center"></div>
                </LocalizedClientLink>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            {/* Mobile Menu - only visible on small screens */}
            <div className="h-full small:hidden">
              <SideMenu regions={regions} />
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
