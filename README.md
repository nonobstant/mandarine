# Aube

Theme for ghost based on the Dawn Theme

**Demo: https://climate.brussels**

&nbsp;

# Instructions

1. [Download this theme]
2. Log into Ghost, and go to the `Design` settings area to upload the zip file

# Search

1. Navigate to the `Integrations` and click on `Add custom integration`. 
2. Copy the content API key; this will be used to fetch posts from your site.
3. Insert the generated key in `Code injection > Site Header` field.

```html
<script>
    var gh_search_key = 'API_KEY';
    var gh_search_migration = 'v1';
</script>
```

The theme generates an index of posts for highly performant search. The index is updated automatically when posts are added or updated. However, it isn't updated when posts are unpublished or deleted.

To force update the index, increment the search index migration version like `'v2'`.

## Disable Content Search

When your site has lots of posts, including the post content in the index cache ends up with exceeding the browser local storage quota. In that case, disabling content search is recommended. Also make sure increase the migration version to force update the old index.

```html
<script>
    var gh_search_key = 'API_KEY';
    var gh_search_migration = 'v2'; // Increased from v1
    var gh_search_content = false; // Disables content search
</script>
```

# Development

Styles are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Gulp](https://gulpjs.com) installed globally. After that, from the theme's root directory:

```bash
# Install
yarn

# Run build & watch for changes
$ yarn dev
```

Now you can edit `/assets/css/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/<theme-name>.zip`, which you can then upload to your site.

```bash
yarn zip
```
