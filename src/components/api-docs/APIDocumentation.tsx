import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useThemeStore } from '../../store/useThemeStore';

interface CodeExampleProps {
  language: string;
  code: string;
}

export const CodeExample = ({ language, code }: CodeExampleProps) => {
  const [copied, setCopied] = useState(false);
  const { mode } = useThemeStore();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Map our internal language keys to SyntaxHighlighter language keys
  const languageMap: Record<string, string> = {
    'curl': 'bash',
    'javascript': 'javascript',
    'nodejs': 'javascript',
    'python': 'python',
    'go': 'go',
    'rust': 'rust',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'csharp': 'csharp'
  };

  return (
    <div className="bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl transition-colors">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-500" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            {language}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-0 bg-zinc-950 overflow-x-auto scrollbar-hide transition-colors">
        <SyntaxHighlighter
          language={languageMap[language] || 'text'}
          style={atomDark}
          wrapLines={false}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            backgroundColor: 'transparent',
            minWidth: 'fit-content'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

type Language = 'curl' | 'javascript' | 'nodejs' | 'python' | 'go' | 'rust' | 'java' | 'c' | 'cpp' | 'csharp';

export const APIDocumentation = ({ apiName, endpoint, apiKey }: { apiName: string, endpoint: any, apiKey?: string }) => {
  const [activeTab, setActiveTab] = useState<Language>('curl');
  const displayKey = apiKey || 'YOUR_API_KEY';
  const baseUrl = 'https://api.apivue.com/v1';

  const examples: Record<Language, string> = {
    curl: `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}" \\
  -H "Authorization: Bearer ${displayKey}" \\
  -H "Content-Type: application/json"`,
    
    javascript: `// Using Fetch API
const response = await fetch('${baseUrl}${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer ${displayKey}',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,

    nodejs: `const https = require('https');

const options = {
  hostname: 'api.apivue.com',
  port: 443,
  path: '/v1${endpoint.path}',
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer ${displayKey}',
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)));
});

req.on('error', (error) => console.error(error));
req.end();`,

    python: `import requests

url = "${baseUrl}${endpoint.path}"
headers = {
    "Authorization": "Bearer ${displayKey}",
    "Content-Type": "application/json"
}

response = requests.${endpoint.method.toLowerCase()}(url, headers=headers)
print(response.json())`,

    go: `package main

import (
	"fmt"
	"net/http"
	"io/ioutil"
)

func main() {
	url := "${baseUrl}${endpoint.path}"
	req, _ := http.NewRequest("${endpoint.method}", url, nil)
	req.Header.Add("Authorization", "Bearer ${displayKey}")
	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)
	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	fmt.Println(string(body))
}`,

    rust: `use reqwest;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let client = reqwest::Client::new();
    let res = client.${endpoint.method.toLowerCase()}("${baseUrl}${endpoint.path}")
        .header("Authorization", "Bearer ${displayKey}")
        .header("Content-Type", "application/json")
        .send()
        .await?;

    println!("Status: {}", res.status());
    let body = res.text().await?;
    println!("Body: {}", body);
    Ok(())
}`,

    java: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("${baseUrl}${endpoint.path}"))
            .header("Authorization", "Bearer ${displayKey}")
            .header("Content-Type", "application/json")
            .method("${endpoint.method}", HttpRequest.BodyPublishers.noBody())
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}`,

    c: `#include <stdio.h>
#include <curl/curl.h>

int main(void) {
  CURL *curl;
  CURLcode res;

  curl = curl_easy_init();
  if(curl) {
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Authorization: Bearer ${displayKey}");
    headers = curl_slist_append(headers, "Content-Type: application/json");

    curl_easy_setopt(curl, CURLOPT_URL, "${baseUrl}${endpoint.path}");
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${endpoint.method}");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

    res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);
  }
  return 0;
}`,

    cpp: `#include <iostream>
#include <cpr/cpr.h>

int main() {
    cpr::Response r = cpr::${endpoint.method === 'GET' ? 'Get' : 'Post'}(
        cpr::Url{"${baseUrl}${endpoint.path}"},
        cpr::Header{{"Authorization", "Bearer ${displayKey}"}, {"Content-Type", "application/json"}}
    );
    std::cout << r.text << std::endl;
    return 0;
}`,

    csharp: `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program {
    static async Task Main() {
        var client = new HttpClient();
        var request = new HttpRequestMessage(HttpMethod.${endpoint.method === 'GET' ? 'Get' : 'Post'}, "${baseUrl}${endpoint.path}");
        request.Headers.Add("Authorization", "Bearer ${displayKey}");
        
        var response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadAsStringAsync();
        Console.WriteLine(body);
    }
}`
  };

  const languages: { id: Language; label: string }[] = [
    { id: 'curl', label: 'cURL' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'nodejs', label: 'Node.js' },
    { id: 'python', label: 'Python' },
    { id: 'go', label: 'Go' },
    { id: 'rust', label: 'Rust' },
    { id: 'java', label: 'Java' },
    { id: 'c', label: 'C' },
    { id: 'cpp', label: 'C++' },
    { id: 'csharp', label: 'C#' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-zinc-50 dark:bg-zinc-900 rounded-xl w-full overflow-x-auto scrollbar-hide border border-[var(--border)]">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setActiveTab(lang.id)}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${
              activeTab === lang.id
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm border border-[var(--border)]'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <CodeExample language={activeTab} code={examples[activeTab]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
