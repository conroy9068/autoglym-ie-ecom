import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-y-5">
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
        >
          {product.collection.title}
        </LocalizedClientLink>
      )}
      <Heading
        level="h2"
        className="text-3xl leading-10 text-ui-fg-base"
        data-testid="product-title"
      >
        {product.title}
      </Heading>

      <div className="flex flex-col gap-y-4">
        <Text
          className="text-base text-ui-fg-base leading-relaxed"
          data-testid="product-description"
        >
          {product.description}
        </Text>

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {product.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 text-xs bg-ui-bg-subtle rounded-md text-ui-fg-muted"
              >
                {tag.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
