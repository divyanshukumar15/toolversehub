import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import CategoryPage from './pages/CategoryPage';
import { categories } from './data/tools';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Category Pages */}
          <Route path="/text-tools" element={<CategoryPage slug="text-tools" />} />
          <Route path="/calculator-tools" element={<CategoryPage slug="calculator-tools" />} />
          <Route path="/image-tools" element={<CategoryPage slug="image-tools" />} />
          <Route path="/converter-tools" element={<CategoryPage slug="converter-tools" />} />

          <Route path="/:slug" element={<ToolPage />} />
          {/* Legal pages could be added here */}
          <Route path="/about" element={<div className="py-20 text-center"><h1 className="text-4xl font-bold">About ToolVerseHub</h1><p className="mt-4 text-gray-500">Your one-stop destination for free online tools.</p></div>} />
          <Route path="/contact" element={<div className="py-20 text-center"><h1 className="text-4xl font-bold">Contact Us</h1><p className="mt-4 text-gray-500">Get in touch with the ToolVerseHub team.</p></div>} />
          <Route path="/privacy" element={<div className="py-20 text-center"><h1 className="text-4xl font-bold">Privacy Policy</h1><p className="mt-4 text-gray-500">We value your privacy.</p></div>} />
          <Route path="/terms" element={<div className="py-20 text-center"><h1 className="text-4xl font-bold">Terms of Service</h1><p className="mt-4 text-gray-500">Rules for using our platform.</p></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}
