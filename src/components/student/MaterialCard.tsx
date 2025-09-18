"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileArchive } from "lucide-react";
import type { Material } from "@/lib/types";

interface MaterialCardProps {
  material: Material;
  index: number;
}

const fileTypeIcons: Record<Material['file_type'], React.ReactNode> = {
  pdf: <FileText className="h-5 w-5" />,
  doc: <FileText className="h-5 w-5" />,
  zip: <FileArchive className="h-5 w-5" />,
};

export function MaterialCard({ material, index }: MaterialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex-row gap-4 items-center">
          <div className="text-primary">{fileTypeIcons[material.file_type]}</div>
          <CardTitle className="text-lg leading-tight">{material.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow"></CardContent>
        <CardFooter>
          <Button asChild className="w-full font-semibold">
            <a href={material.file_url} download target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
