# Parcel Plugin Iconify

A parcel plugin to add iconify icons

## Usage

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
    // mdiVideo be replaced as svg string
    import mdiVideo from 'iconify-icon:mdi/video'
</script>
```
