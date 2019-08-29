# rm -rf public

# mkdir public

npm run build

file1="public/404.html"
file2="public/index.html"
if [ -f $file1 ] ; then
  rm $file1
fi
if [ -f $file2 ] ; then
  rm $file2
fi

cp -R functions/nuxt/dist public

cp -R static/* public

firebase serve --only functions,hosting
