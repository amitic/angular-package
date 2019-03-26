
PACKAGES=${PACKAGES:-change-detection core docs prism}
cd packages

for package in ${PACKAGES[*]}; do
  echo "$package"
  cd ${package}
  packagejson=$(ls package.json 2>/dev/null || true) 
  if [[ $packagejson == *"package.json"* ]]; then
    npm install
    npm run clean:start
  fi
  cd ..
done

cd ..
