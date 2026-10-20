IMPORTANT: the site currently has a bootstrap data/snapshot.json and no GitHub Actions workflow.

1. Upload/replace the visible site files in this package at repository root.
2. In GitHub choose Add file > Create new file.
3. Name the new file exactly:
   .github/workflows/update-data.yml
4. Paste the contents of WORKFLOW_UPDATE_DATA.yml into it and commit to main.
5. The push-triggered workflow should run automatically. If not, open Actions > Update static data snapshot > Run workflow.
6. When it completes, data/snapshot.json should have a non-null generatedAt and populated global maps.

This package also cache-busts app.js/styles.css and has a fail-visible startup banner so future JS errors do not produce a silent blank page.
