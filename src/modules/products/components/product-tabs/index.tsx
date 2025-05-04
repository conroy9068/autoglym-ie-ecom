"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import { HttpTypes } from "@medusajs/types"

import Accordion from "./accordion"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Product Description",
      component: <ProductDescriptionTab product={product} />,
    },
    {
      label: "Product Information",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Shipping & Returns",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
            className={i === 0 ? "!border-t-0" : ""}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductDescriptionTab = ({ product }: ProductTabsProps) => {
  if (!product.description) return null

  const paragraphs = product.description
    .split('\n')
    .filter(paragraph => paragraph.trim().length > 0)

  return (
    <div className="py-8">
      {paragraphs.length > 0 ? (
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-ui-fg-base text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-ui-fg-base text-base leading-relaxed">{product.description}</p>
      )}
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 small:grid-cols-2 gap-y-6 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-ui-fg-base">Material</span>
            <p className="mt-1">{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-ui-fg-base">Country of origin</span>
            <p className="mt-1">{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-ui-fg-base">Type</span>
            <p className="mt-1">{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-ui-fg-base">Weight</span>
            <p className="mt-1">{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-ui-fg-base">Dimensions</span>
            <p className="mt-1">
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
          {product.tags && product.tags.length > 0 && (
            <div>
              <span className="font-semibold text-ui-fg-base">Tags</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 text-xs bg-ui-bg-subtle rounded-md text-ui-fg-muted"
                  >
                    {tag.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery className="text-ui-fg-base" />
          <div>
            <span className="font-semibold text-ui-fg-base">Fast delivery</span>
            <p className="max-w-sm mt-1">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh className="text-ui-fg-base" />
          <div>
            <span className="font-semibold text-ui-fg-base">Simple exchanges</span>
            <p className="max-w-sm mt-1">
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back className="text-ui-fg-base" />
          <div>
            <span className="font-semibold text-ui-fg-base">Easy returns</span>
            <p className="max-w-sm mt-1">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
