# Parcel Plugin Iconify

A parcel plugin to add iconify icons

## Usage

To install, run `npm install -D parcel-resolver-iconify parcel-transformer-iconify` (you need both packages for it to work)

Note: I didn't optimize this yet, so it will download the entire iconify icon set (300+MB unziped)

```html
<!-- Will be replaced as svg tag -->
<iconify-icon icon="mdi:video"></iconify-icon>

<style>
    :root {
        /* Will be replaced as --video-icon: url(data:image/svg+xml,...) */
        --video-icon: url(iconify-icon:mdi/video)
    }
</style>

<script type="module">
    // Will be replaced as svg string
    import mdiVideo from 'iconify-icon:mdi/video'
</script>
```

For typescript typing, add `/// <reference types="parcel-resolver-iconify/missing-types" />` to a ts or .d.ts file or add `"compilerOptions": { "types": ["parcel-resolver-iconify/missing-types"] }` to tsconfig.json

Example .parcelrc file

```json5
{
    "extends": "@parcel/config-default",
    "transformers": {
        "*.html": [
            "parcel-transformer-iconify",
            "...",
        ],
        "iconify-icon:*": [
            "parcel-transformer-iconify",
            "...",
        ],
    },
    "resolvers": [
        "parcel-resolver-iconify",
        "...",
    ]
}
```

---

I didn't know [unplugin-icons](https://github.com/antfu/unplugin-icons) when I first made this plugin at the begining of 2023, so the format and configurations're not compatible, and I don't have much time to make it so (or make support in unplugin icons), but I feel like I should publish this anyway since it lacks support for parcel
