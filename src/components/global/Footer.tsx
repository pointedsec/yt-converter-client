import { Card } from "@/components/ui/card";

export default function Footer() {
  return (
    <Card className="w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-6 px-4 text-center">
      <div className="flex flex-col items-center">
        <div className="bg-gray-900 rounded-2xl mb-4">
            <img src="/logo.png" alt="Logo" width={200} height={200} className="mb-2" />
        </div>
        <p className="text-sm">© {new Date().getFullYear()} YT-API-CLIENT. Todos los derechos reservados.</p>
        <p className="text-sm">Developed with ❤️ by <a href="https://github.com/pointedsec" target="_blank" className="underline">pointedsec</a></p>
      </div>
    </Card>
  );
}
