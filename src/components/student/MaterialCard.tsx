"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileArchive } from "lucide-react";
import type { Material } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface MaterialCardProps {
  material: Material;
  index: number;
}

const fileTypeIcons: Record<Material['file_type'], React.ReactNode> = {
  pdf: <FileText className="h-5 w-5" />,
  doc: <FileText className="h-5 w-5" />,
  zip: <FileArchive className="h-5 w-5" />,
};

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export function MaterialCard({ material, index }: MaterialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex-row gap-4 items-start">
          <div className="text-primary mt-1">{fileTypeIcons[material.file_type]}</div>
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-2">{material.title}</CardTitle>
            <div className="flex gap-2">
                <Badge variant="secondary">{material.file_type.toUpperCase()}</Badge>
                {material.size && <Badge variant="outline">{formatBytes(material.size)}</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow"></CardContent>
        <CardFooter>
          <Button asChild className="w-full font-semibold">
            <a href={material.file_url} download>
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
