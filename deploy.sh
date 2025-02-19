echo "Switching to bracnh main"
git checkout main

echo "Bulding app..."
npm run build

echo "Deploying files to server"
scp -r build/* exapos@46.28.108.153:/var/www/maxprojekty/

echo "Done!"