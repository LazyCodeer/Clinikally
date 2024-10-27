# Project Structure and File Information

This project is an Expo app created with `create-expo-app`. Below is a detailed description of the project structure and the purpose of each file and directory.

---

## Root Directory

- **`.expo/`**: Contains Expo-specific configuration files.

  - **`devices.json`**: Configuration for connected devices.
  - **`README.md`**: Documentation for the `.expo` directory.
  - **`types/`**: Type definitions for Expo.
  - **`web/`**: Web-specific configurations for Expo.

- **`.gitignore`**: Specifies files and directories to be ignored by Git.

- **`.vscode/`**: Contains Visual Studio Code-specific settings.

  - **`.react/`**: React-specific settings for VS Code.

- **`app/`**: Main directory for the app's source code.

  - **`_layout.tsx`**: Root layout component for the app.
  - **`(tabs)/`**: Contains tab navigation components.
  - **`+html.tsx`**: Configuration for the root HTML during static rendering.
  - **`productDetail.jsx`**: Component for displaying product details.
  - **`search.jsx`**: Component for the search screen.
  - **`app.json`**: Configuration file for the Expo app.

- **`assets/`**: Contains static assets like data, fonts, and images.

  - **`data/`**: JSON files with data for the app.

    - **`products.json`**: Contains product data used throughout the app, including details such as product ID, name, prices, description, image URL, stock status, and timestamps for creation and updates. Example entry:
      ```json
      {
        "id": 4,
        "name": "Product 1",
        "originalPrice": 63.54,
        "discountPrice": 56.56,
        "description": "",
        "image": "https://img.freepik.com/free-photo/skin-care-banner-concept-with-makeup_23-2149449137.jpg?t=st=1729957976~exp=1729961576~hmac=2a8f9348358dc70718cd6500d5b4848a7c5110eee1ef1870d80d8c7295850349&w=1380",
        "inStock": true,
        "created_at": "2024-10-26T13:53:57.884177Z",
        "updated_at": "2024-10-26T13:53:57.884177Z"
      }
      ```
    - **`pincodes.json`**: Contains pincode delivery data, with each entry providing:
      - `pincode`: The pincode for the delivery location.
      - `provider`: The logistics provider handling deliveries to this pincode.
      - `tat`: The turnaround time (in days) estimated for delivery to the specified pincode.
        Example entry:
      ```json
      {
        "pincode": 100001,
        "provider": "Provider A",
        "tat": 5
      }
      ```

  - **`fonts/`**: Custom fonts used in the app.
  - **`images/`**: Images used in the app.

- **`babel.config.js`**: Configuration file for Babel.

- **`components/`**: Contains reusable UI components.

  - **`tests/`**: Directory for component tests.
  - **`Container.tsx`**: Container component for wrapping other components.
  - **`navigation/`**: Navigation-related components.
  - **`OfferCarousel.jsx`**: Component for displaying a carousel of offers.
  - **`OfferCarouselItem.tsx`**: Component for individual items in the offer carousel.
  - **`ProductCard.jsx`**: Component for displaying individual product cards.
  - **`SearchBar.jsx`**: Component for the search bar.

- **`constants/`**: Contains constant values used throughout the app.

  - **`Colors.ts`**: Color constants.
  - **`Typography.ts`**: Typography constants.

- **`context/`**: Contains context providers for state management.

  - **`CartContext.tsx`**: Context provider for managing the shopping cart state.

- **`expo-env.d.ts`**: Type definitions for Expo environment variables.

- **`package.json`**: Configuration file for npm, including scripts and dependencies.

- **`README.md`**: Documentation for the project.

- **`tsconfig.json`**: Configuration file for TypeScript.

---

## Detailed File Descriptions

### `_layout.tsx`

Defines the root layout for the app, setting up the navigation stack and including the `CartProvider` to manage cart state globally.

### `index.jsx`

Contains the `HomeScreen` component, displaying a list of products. Utilizes the `ProductCard` component to render individual products and includes a search bar.

### `productDetail.jsx`

Defines the `ProductDetailScreen` component, which displays detailed information about a selected product. Includes functionality for validating pincode and calculating delivery dates.

### `search.jsx`

Contains the `SearchScreen` component, allowing users to search for products. Filters products based on the search query and displays them using the `ProductCard` component.

### `Container.tsx`

Defines a `Container` component that wraps other components, providing consistent padding and styling.

### `OfferCarousel.jsx`

Contains the `OfferCarousel` component, displaying a carousel of offers using the `react-native-snap-carousel` library.

### `OfferCarouselItem.tsx`

Defines the `OfferCarouselItem` component, representing individual items in the offer carousel.

### `ProductCard.jsx`

Contains the `ProductCard` component, which displays individual product information, including an image, name, price, and an "Add to Cart" button.

### `SearchBar.jsx`

Contains the `SearchBar` component, providing a text input for searching products.

### `Colors.ts`

Defines color constants used throughout the app for consistent styling.

### `Typography.ts`

Defines typography constants used throughout the app for consistent text styling.

### `CartContext.tsx`

Defines the `CartContext` and `CartProvider`, managing the state of the shopping cart, including adding, updating, and removing items.

### `products.json`

Contains product data used throughout the app, with each product object holding fields for:

- `id`: Unique identifier for the product.
- `name`: Name of the product.
- `originalPrice`: Original price before any discounts.
- `discountPrice`: Price after applying discounts.
- `description`: Brief description of the product.
- `image`: Link to the product image.
- `inStock`: Availability status (e.g., `true` or `false`).
- `created_at`: Timestamp for product creation.
- `updated_at`: Timestamp for the last update.

### `offers.json`

Contains offer data displayed in the offer carousel, with each offer object including:

- `offerID`: Unique identifier for the offer.
- `title`: Title of the offer.
- `description`: Brief description of the offer.
- `imageURL`: Link to the offer image.

### `pincodes.json`

Contains pincode delivery data, with each entry including:

- `pincode`: The pincode for the delivery location.
- `provider`: The logistics provider managing deliveries to this pincode.
- `tat`: The turnaround time (in days) estimated for delivery to the specified pincode.

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the app**
   ```bash
   npm start
   ```

# Tools used

1. **CSVJSON:** Used to convert CSV files to JSON format.
2. **Freepik:** Used demo images from this resource.
3. **Figma:** https://www.figma.com/design/76EEh5cwQkzPSDAxp6vQg4/Clinikally?node-id=0-1&t=QxwnchLgh4wUQq5P-1

# Instructions to Run the Expo App "Clinikally"

Here are the steps to set up and run the Expo app "Clinikally Done" on your device.

## Prerequisites

1. **Install Expo Go:**

   - First, download and install the Expo Go app from the Google Play Store:
     - [Expo Go on Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&pcampaignid=web_share)

2. **Access the Project:**
   - You can view the project hosted on Expo using the link below:
     - [Clinikally Done Project](https://expo.dev/preview/update?message=clinikally&updateRuntimeVersion=1.0.0&createdAt=2024-10-27T10%3A27%3A52.675Z&slug=exp&projectId=37e1b7ff-6b57-4931-8f05-61ebb8fb21bf&group=8719a58f-1e27-417b-b845-23ee9d6ead50)

## Steps to Run the App

1. **Open Expo Go:**

   - Launch the Expo Go app on your mobile device.

2. **Scan the QR Code:**

   - In the Expo Go app, tap on "Scan QR Code." You might need to allow the app to access your camera..

3. **Wait for Loading:**
   - The app should load, and you’ll be able to start using "Clinikally Done."

## Additional Notes

- Ensure your device is connected to the internet to access the project.
- If you run into any issues, please make sure that your Expo Go app is updated, and try restarting the app.

Let me know if you need any further assistance!

Best Regards,
**Sagar Kumar**
