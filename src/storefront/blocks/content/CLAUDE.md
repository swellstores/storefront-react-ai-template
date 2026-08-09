# src/storefront/blocks/content

Import from: `@/storefront/blocks`

## Exports

### ContentActions

Renders a group of content call-to-action buttons or links.

Properties:

- `actions: Array<{ label: ReactNode; href: string; variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"; external?: boolean; icon?: ReactNode; className?: string; }>`
  Action definitions to render.
- `className?: string`
  Styles the actions group root.
- `actionClassName?: string`
  Styles every action button.
- `externalIconClassName?: string`
  Styles the generated external-link icon.
- `size?: "default" | "xs" | "sm" | "lg"`
  shadcn button size used for every action.
- `showExternalIcon?: boolean`
  Controls whether external actions show a trailing external-link icon.

### ContentFeature

Renders a single feature, benefit, step, or value proposition.

Properties:

- `title: ReactNode`
  Feature title content.
- `description?: ReactNode`
  Optional supporting description.
- `icon?: ReactNode`
  Optional icon rendered above the title.
- `index?: ReactNode`
  Optional index or step marker rendered above the title.
- `href?: string`
  Optional route or URL for the feature link.
- `linkLabel?: ReactNode`
  Optional link label; the link is rendered only when href and linkLabel are both provided.
- `level?: HeadingLevel`
  Semantic heading level passed to the Heading primitive.
- `variant?: "plain" | "card" | "step"`
  Visual feature preset.
- `align?: "start" | "center" | "end"`
  Text alignment preset.
- `className?: string`
  Styles the feature root.
- `iconClassName?: string`
  Styles the icon wrapper.
- `indexClassName?: string`
  Styles the index marker.
- `titleClassName?: string`
  Styles the title heading.
- `descriptionClassName?: string`
  Styles the description text.
- `linkClassName?: string`
  Styles the optional link.

### ContentHeader

Renders reusable section header content with optional eyebrow and description.

Properties:

- `title: ReactNode`
  Main heading content.
- `eyebrow?: ReactNode`
  Optional short label rendered above the title.
- `description?: ReactNode`
  Optional supporting copy rendered below the title.
- `level?: HeadingLevel`
  Semantic heading level passed to the Heading primitive.
- `size?: "sm" | "md" | "lg" | "xl"`
  Preset typography scale for the header.
- `align?: "start" | "center" | "end"`
  Text alignment preset.
- `className?: string`
  Styles the header root.
- `eyebrowClassName?: string`
  Styles the eyebrow text.
- `titleClassName?: string`
  Styles the title heading.
- `descriptionClassName?: string`
  Styles the description text.

### ContentMarquee

Renders a horizontally scrolling marquee / ticker band that repeats its
content in a seamless loop. CSS-driven animation; honors prefers-reduced-
motion (the band renders static, without scrolling, when reduced motion is
requested).

Properties:

- `items: ReactNode[]`
  Items rendered in sequence and repeated across the band (words, phrases, or small nodes).
- `separator?: ReactNode`
  Optional node rendered between items as a separator (e.g. a dot or slash).
- `speed?: "slow" | "default" | "fast"`
  Scroll speed preset.
- `direction?: "left" | "right"`
  Scroll direction.
- `variant?: "plain" | "band"`
  Visual band preset. "plain" scrolls on the page ground; "band" fills a full-width inverted surface.
- `pauseOnHover?: boolean`
  Pause the scroll while the pointer is over the band.
- `className?: string`
  Styles the marquee root (the clipping band).
- `itemClassName?: string`
  Styles each rendered item.
- `separatorClassName?: string`
  Styles the separator between items.

### ContentMedia

Renders editorial or promotional media with an optional caption.

Properties:

- `src: string`
  Image source URL.
- `alt: string`
  Accessible image alternative text.
- `caption?: ReactNode`
  Optional caption rendered below the image.
- `width?: number`
  Intrinsic image width passed to the Image primitive.
- `height?: number`
  Intrinsic image height passed to the Image primitive.
- `sizes?: string`
  Responsive image sizes passed to the Image primitive.
- `loading?: "eager" | "lazy"`
  Native image loading strategy.
- `className?: string`
  Styles the figure root.
- `frameClassName?: string`
  Styles the image frame.
- `imageClassName?: string`
  Styles the image element.
- `captionClassName?: string`
  Styles the caption text.

### ContentQuote

Renders a pull quote, testimonial, or press quote.

Properties:

- `quote: ReactNode`
  Quote body content.
- `attribution?: ReactNode`
  Optional person or organization credited for the quote.
- `source?: ReactNode`
  Optional source context such as role, publication, or company.
- `cite?: string`
  Optional citation URL passed to the blockquote cite attribute.
- `variant?: "editorial" | "card" | "minimal"`
  Visual quote preset.
- `size?: "sm" | "md" | "lg"`
  Quote typography scale.
- `align?: "start" | "center" | "end"`
  Text alignment preset.
- `className?: string`
  Styles the quote figure root.
- `quoteClassName?: string`
  Styles the quote body text.
- `footerClassName?: string`
  Styles the attribution/source footer.
- `attributionClassName?: string`
  Styles the attribution text.
- `sourceClassName?: string`
  Styles the source text.

### ContentSpecifications

Renders a structured specification list for product, brand, or editorial details.

Properties:

- `items: Array<{ label: ReactNode; value: ReactNode; }>`
  Specification rows to render.
- `title?: ReactNode`
  Optional heading rendered above the list.
- `level?: HeadingLevel`
  Semantic heading level used when title is provided.
- `className?: string`
  Styles the block root.
- `titleClassName?: string`
  Styles the optional title heading.
- `listClassName?: string`
  Styles the definition list wrapper.
- `rowClassName?: string`
  Styles each specification row.
- `labelClassName?: string`
  Styles each specification label.
- `valueClassName?: string`
  Styles each specification value.
