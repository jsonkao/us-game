rm -rf final && mkdir final

find ./raw \! -name .DS_Store -type f -print0 | while read -d $'\0' file
do
  f=${file##*/}
  cwebp -mt -quiet "$file" -resize 200 0 -q 90 -o "final/${f%.png}".webp
done