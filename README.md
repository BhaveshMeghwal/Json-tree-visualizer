# 🧠 JSON Tree Visualizer

An interactive web app built with **Next.js**, **React Flow**, and **Tailwind CSS** that helps you quickly visualize and explore JSON data in a tree-style graph. Search, navigate, and copy JSON paths with a single click — perfect for debugging APIs and working with deeply nested data.

---

## 🚀 Features

- ✅ **Interactive Tree View** — Visualize JSON as connected nodes and edges for easier structure comprehension.
- ✅ **Path Search** — Find nodes by JSON path (for example: `$.user.address.city`) and highlight them in the graph.
- ✅ **Path Copy** — Click any node to copy its exact JSON path to the clipboard.
- ✅ **Dark / Light Mode** — Toggle between themes to match your environment.
- ✅ **Responsive** — Layout adapts for desktop and tablet screens.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** | App structure & rendering |
| **React Flow** | Visualizing nodes and edges |
| **Tailwind CSS** | Styling and responsive design |
| **TypeScript** | Type safety and clearer code |

---

## ⚙️ Installation & Setup


```powershell
# 1️⃣ Clone the repository
git clone https://github.com/BhaveshMeghwal/json-tree-visualizer.git

# 2️⃣ Move into the project folder
cd json-tree-visualizer

# 3️⃣ Install dependencies
npm install

# 4️⃣ Run the development server
npm run dev

# Then open http://localhost:3000 in your browser
```

If you use yarn or pnpm, replace `npm install` and `npm run dev` with `yarn`/`yarn dev` or `pnpm install`/`pnpm dev`.

---

## 🧭 Usage

1. Paste or load JSON in the input area.
2. The app renders an interactive tree where each key/value is a node.
3. Use the search bar to jump to a node by JSON path.
4. Click a node to copy its JSON path to the clipboard.

Tip: Start with small JSON snippets while exploring; large payloads render progressively but may require more memory.

---

## 🔧 Configuration & Development

- The app uses React Flow for graph rendering and custom node components located in `app/components/`.
- Tailwind configuration is in `tailwind.config.js`.
- TypeScript config is in `tsconfig.json`.

To add or extend features:

1. Create/update components in `app/components/`.
2. Add styles in `app/globals.css` or Tailwind config.
3. Run the dev server and test in-browser.


