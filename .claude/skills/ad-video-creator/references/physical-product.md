# Physical product

If the product reference images doesn't have enough different angles and positions, create more by running the generate-single-image script:

```
bun run generate-single-image.ts --prompt "The prompt to generate the image" --output-image-path "src/assets/reference-images/<angle-name>.png"
```

For example:
```
bun run generate-single-reference-image.ts --prompt --reference-image-directory "src/reference-images" --output-image-path "src/assets/reference-images/back.png"
```