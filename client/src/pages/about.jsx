import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import coffeeImg from "../assets/market.jpg"; // 👈 replace with your asset

export default function About() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        <img
          src={coffeeImg}
          alt="Kahawa Trace"
          className="w-full h-64 object-cover rounded-2xl shadow-md"
        />
        <h1 className="text-4xl font-extrabold text-green-800">About Kahawa Trace</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A digital platform connecting Kenyan coffee farmers directly with buyers,
          empowering communities, and building transparency across the value chain.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
      >
        <Card className="shadow-lg border-l-4 border-green-600">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700">🌱 Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-gray-700">
              At <span className="font-semibold text-green-700">Kahawa Trace</span>,
              our mission is to revolutionize coffee farming in Kenya. We empower farmers
              with access to fair markets, real-time data, and digital traceability tools.
              From farm to cup, we ensure that every coffee bean carries a story of trust,
              sustainability, and farmer empowerment.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Vision */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
      >
        <Card className="shadow-lg border-l-4 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-2xl text-yellow-600">🌍 Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-gray-700">
              We envision a transparent, farmer-first economy where smallholder farmers
              gain global recognition and fair value for their hard work. By digitizing
              coffee farming, Kahawa Trace aims to eliminate exploitation, increase farmer
              earnings, and drive sustainable livelihoods.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* What We Offer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Card className="shadow-lg border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600">🚀 What We Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li>
                <strong>Market Linkage:</strong> Farmers connect directly with
                buyers, cutting out middlemen.
              </li>
              <li>
                <strong>Traceability:</strong> Every coffee bean can be traced from farm to buyer,
                ensuring authenticity.
              </li>
              <li>
                <strong>Weather & Pest Alerts:</strong> Real-time updates to help farmers protect their crops.
              </li>
              <li>
                <strong>Financial Inclusion:</strong> Digital payments and access to microloans.
              </li>
              <li>
                <strong>Training & Resources:</strong> Knowledge base for modern farming techniques.
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Values */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <Card className="shadow-lg border-l-4 border-purple-500">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600">🤝 Our Core Values</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <li><span className="font-medium">Transparency:</span> Building trust across the supply chain.</li>
              <li><span className="font-medium">Innovation:</span> Using tech to solve real farming challenges.</li>
              <li><span className="font-medium">Fairness:</span> Ensuring farmers get true value for their crops.</li>
              <li><span className="font-medium">Sustainability:</span> Promoting eco-friendly farming practices.</li>
              <li><span className="font-medium">Community:</span> Strengthening farmer networks and co-ops.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Closing Statement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="text-center space-y-3"
      >
        <h2 className="text-3xl font-bold text-green-700">🌟 The Future of Coffee Starts Here</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Kahawa Trace is more than just a platform—it is a movement to empower
          farmers, delight buyers, and transform Kenya’s coffee industry. Together,
          we are shaping the future of agriculture.
        </p>
      </motion.div>
    </div>
  );
}
