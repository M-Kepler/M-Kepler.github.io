#!/usr/bin/bash

rm -rf docs/.vuepress/.cache docs/.vuepress/.temp

pnpm add vuepress@2.0.0-beta.51 \
	@vuepress/client@2.0.0-beta.51 \
	vuepress-theme-hope@2.0.0-beta.108 \
	@vuepress/plugin-google-analytics@2.0.0-beta.51 \
	@vuepress/plugin-search@2.0.0-beta.51 \
	@vuepress/plugin-docsearch@2.0.0-beta.51

start http://localhost:3000

pnpm docs:dev --port=3000
