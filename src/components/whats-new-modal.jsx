"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Brain,
  Lightbulb,
  BellRing,
  Fingerprint,
  BookOpen,
  Activity,
  DollarSign,
  GraduationCap,
  CreditCard,
  Bot,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const iconMap = {
  Brain,
  Lightbulb,
  BellRing,
  Fingerprint,
  BookOpen,
  Activity,
  DollarSign,
  GraduationCap,
  CreditCard,
  Bot,
};

export default function WhatsNewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has seen this version
    const lastSeenVersion = localStorage.getItem("drais_last_seen_version");
    const currentVersion = "0.0.0018"; // Should match DRAIS_VERSION

    // Fetch features
    fetch("/features.json")
      .then((res) => res.json())
      .then((data) => {
        setFeatures(data.features.filter((f) => f.tag === "NEW"));
        setLoading(false);

        // Show modal only if user hasn't seen this version
        if (lastSeenVersion !== currentVersion) {
          setTimeout(() => setIsOpen(true), 1000);
        }
      })
      .catch((err) => {
        console.error("Failed to load features:", err);
        setLoading(false);
      });
  }, []);

  const handleClose = () => {
    // Save version to localStorage
    localStorage.setItem("drais_last_seen_version", "0.0.0018");
    setIsOpen(false);
  };

  if (loading || features.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">What's New in DRAIS v0.0.0018</DialogTitle>
              <DialogDescription className="text-base">
                Exciting new features and improvements!
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Sparkles;
            const gradientColors = [
              "from-purple-500 to-pink-600",
              "from-blue-500 to-cyan-600",
              "from-green-500 to-emerald-600",
              "from-orange-500 to-amber-600",
              "from-pink-500 to-rose-600",
            ];
            const gradient = gradientColors[index % gradientColors.length];

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-purple-400 dark:hover:border-purple-600">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                            {feature.tag}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {feature.description}
                        </p>
                        {feature.highlights && (
                          <ul className="space-y-1">
                            {feature.highlights.slice(0, 3).map((highlight, hIndex) => (
                              <li key={hIndex} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <Link href={feature.route}>
                        <Button size="sm" className={`bg-gradient-to-r ${gradient}`}>
                          Try Now
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🎉 {features.length} new features added this release
          </p>
          <Button onClick={handleClose} className="bg-gradient-to-r from-blue-600 to-purple-600">
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
