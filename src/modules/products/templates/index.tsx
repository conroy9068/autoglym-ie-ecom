import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div className="content-container py-2">
        <nav className="flex text-sm">
          <a href="/" className="text-ui-fg-muted hover:text-ui-fg-base">Home</a>
          <span className="mx-2 text-ui-fg-muted">/</span>
          <a href="/store" className="text-ui-fg-muted hover:text-ui-fg-base">Shop By Category</a>
          {product.collection && (
            <>
              <span className="mx-2 text-ui-fg-muted">/</span>
              <a
                href={`/collections/${product.collection.handle}`}
                className="text-ui-fg-muted hover:text-ui-fg-base"
              >
                {product.collection.title}
              </a>
            </>
          )}
          <span className="mx-2 text-ui-fg-muted">/</span>
          <span className="text-ui-fg-base">{product.title}</span>
        </nav>
      </div>

      <div
        className="content-container flex flex-col small:flex-row gap-y-8 small:gap-x-10 py-6 relative"
        data-testid="product-container"
      >
        {/* Left side - Product Images */}
        <div className="flex-1 w-full small:max-w-[50%]">
          <ImageGallery images={product?.images || []} />
        </div>

        {/* Right side - Product Info and Actions */}
        <div className="flex-1 flex flex-col gap-y-8">
          <ProductInfo product={product} />

          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>

          <div className="pt-2">
            <ProductTabs product={product} />
          </div>

          <ProductOnboardingCta />
        </div>
      </div>

      {/* Related Products */}
      <div
        className="content-container my-16"
        data-testid="related-products-container"
      >
        <Heading level="h2" className="text-2xl mb-6">
          Recently Viewed Products
        </Heading>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate

