import React, { useState, useEffect, useMemo } from 'react';
import { Play, Loader2, Terminal, Send, AlertCircle, CheckCircle2, Code2, ListTree } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactJson from 'react-json-view';
import { Endpoint } from '../../types';
import { useThemeStore } from '../../store/useThemeStore';

interface APIPlaygroundProps {
  endpoint: Endpoint;
  apiKey?: string;
  primaryColor: string;
}

export const APIPlayground = ({ endpoint, apiKey, primaryColor }: APIPlaygroundProps) => {
  const [params, setParams] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState<string>(endpoint.sampleRequest || '{}');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'raw' | 'tree'>('tree');
  const { mode } = useThemeStore();

  // Initialize params and headers
  useEffect(() => {
    const initialParams: Record<string, string> = {};
    endpoint.parameters?.forEach(p => {
      if (p.location === 'query' || p.location === 'path') {
        initialParams[p.name] = '';
      }
    });
    setParams(initialParams);

    const initialHeaders: Record<string, string> = {
      'Authorization': apiKey ? `Bearer ${apiKey}` : 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    };
    endpoint.headers?.forEach(h => {
      initialHeaders[h.name] = '';
    });
    setHeaders(initialHeaders);
    
    setBody(endpoint.sampleRequest || '{}');
    setResponse(null);
    setStatus(null);
  }, [endpoint, apiKey]);

  const handleParamChange = (name: string, value: string) => {
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const handleHeaderChange = (name: string, value: string) => {
    setHeaders(prev => ({ ...prev, [name]: value }));
  };

  const runTest = async () => {
    setIsLoading(true);
    setResponse(null);
    setStatus(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, we would use fetch here with the constructed URL and headers
    setResponse(endpoint.sampleResponse || '{"message": "Success"}');
    setStatus(200);
    setIsLoading(false);
  };

  const getFullUrl = () => {
    let url = `https://api.apivue.com/v1${endpoint.path}`;
    
    // Replace path parameters
    Object.entries(params).forEach(([key, value]) => {
      if (endpoint.path.includes(`{${key}}`)) {
        url = url.replace(`{${key}}`, value || `{${key}}`);
      }
    });

    // Add query parameters
    const queryParams = endpoint.parameters?.filter(p => p.location === 'query') || [];
    const activeQueryParams = queryParams
      .filter(p => params[p.name])
      .map(p => `${p.name}=${encodeURIComponent(params[p.name])}`);
    
    // Add API Key to URL as requested
    activeQueryParams.push(`api_key=${apiKey || 'YOUR_API_KEY'}`);
    
    if (activeQueryParams.length > 0) {
      url += `?${activeQueryParams.join('&')}`;
    }

    return url;
  };

  const missingRequiredParams = endpoint.parameters?.filter(p => p.required && !params[p.name]) || [];
  
  const isBodyValidJson = useMemo(() => {
    if (endpoint.method !== 'POST' && endpoint.method !== 'PUT') return true;
    if (!body.trim()) return true; // Empty body is technically valid or handled by server
    try {
      JSON.parse(body);
      return true;
    } catch (e) {
      return false;
    }
  }, [body, endpoint.method]);

  const canRunTest = missingRequiredParams.length === 0 && !!apiKey && isBodyValidJson;

  const parsedResponse = useMemo(() => {
    if (!response) return null;
    try {
      return JSON.parse(response);
    } catch (e) {
      return { error: 'Invalid JSON response' };
    }
  }, [response]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-xl overflow-hidden flex flex-col h-full min-h-[600px] transition-colors">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 dark:bg-white/10 rounded-lg">
            <Play className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">API Playground</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded ${
            endpoint.method === 'GET' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
          }`}>
            {endpoint.method}
          </span>
        </div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Inputs */}
        <div className="w-full lg:w-1/2 p-6 overflow-y-auto custom-scrollbar border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 space-y-6 bg-white dark:bg-zinc-900 transition-colors">
          {/* URL Display */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Request URL</label>
            <div className="p-3 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-xs text-zinc-600 dark:text-zinc-300 break-all">
              {getFullUrl()}
            </div>
          </div>

          {/* Path & Query Parameters */}
          {(endpoint.parameters?.length || 0) > 0 && (
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Parameters</label>
              <div className="space-y-3">
                {endpoint.parameters?.map(p => (
                  <div key={p.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{p.name} <span className="text-zinc-500 font-normal">({p.location})</span></span>
                      {p.required && <span className="text-[9px] font-bold text-red-500 uppercase">Required</span>}
                    </div>
                    <input 
                      type="text"
                      value={params[p.name] || ''}
                      onChange={(e) => handleParamChange(p.name, e.target.value)}
                      placeholder={p.type}
                      className="w-full bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Headers */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Headers</label>
            <div className="space-y-3">
              {Object.entries(headers).map(([name, value]) => (
                <div key={name} className="space-y-1.5">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{name}</span>
                  <input 
                    type="text"
                    value={value}
                    onChange={(e) => handleHeaderChange(name, e.target.value)}
                    className="w-full bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-all"
                    disabled={name === 'Authorization' || name === 'Content-Type'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          {(endpoint.method === 'POST' || endpoint.method === 'PUT') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Body (JSON)</label>
                {!isBodyValidJson && (
                  <span className="text-[9px] font-bold text-red-500 uppercase flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Invalid JSON
                  </span>
                )}
              </div>
              <textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={`w-full h-40 bg-white dark:bg-zinc-800/50 border rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white font-mono outline-none transition-all resize-none ${
                  isBodyValidJson ? 'border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500' : 'border-red-500/50 focus:border-red-500'
                }`}
              />
            </div>
          )}

          <button 
            onClick={runTest}
            disabled={isLoading || !canRunTest}
            className="w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group mt-4"
            style={{ 
              backgroundColor: primaryColor,
              boxShadow: canRunTest ? `0 0 20px ${primaryColor}66` : 'none'
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            )}
            {isLoading ? 'Sending...' : 'Send Request'}
          </button>
          {!apiKey && (
            <p className="text-[10px] text-red-500 text-center mt-2 font-bold uppercase tracking-wider">
              Please subscribe to get an API key
            </p>
          )}
          {apiKey && missingRequiredParams.length > 0 && (
            <p className="text-[10px] text-amber-500 text-center mt-2 font-bold uppercase tracking-wider">
              Missing required: {missingRequiredParams.map(p => p.name).join(', ')}
            </p>
          )}
          {apiKey && missingRequiredParams.length === 0 && !isBodyValidJson && (
            <p className="text-[10px] text-red-500 text-center mt-2 font-bold uppercase tracking-wider">
              Invalid JSON in request body
            </p>
          )}
        </div>

        {/* Right Panel: Response */}
        <div className="w-full lg:w-1/2 bg-zinc-50 dark:bg-black flex flex-col overflow-hidden transition-colors">
          <div className="px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-100/50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Response</span>
              {response && (
                <div className="flex p-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
                  <button 
                    onClick={() => setViewMode('tree')}
                    className={`p-1 rounded-md transition-all ${viewMode === 'tree' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                    title="Tree View"
                  >
                    <ListTree className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('raw')}
                    className={`p-1 rounded-md transition-all ${viewMode === 'raw' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                    title="Raw View"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            {status && (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status < 400 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${status < 400 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {status} {status === 200 ? 'OK' : 'Error'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-grow overflow-auto custom-scrollbar p-0 bg-black transition-colors">
            {response ? (
              viewMode === 'raw' ? (
                <SyntaxHighlighter
                  language="json"
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    backgroundColor: 'transparent',
                  }}
                >
                  {response}
                </SyntaxHighlighter>
              ) : (
                <div className="p-6">
                  <ReactJson 
                    src={parsedResponse} 
                    theme="monokai"
                    displayDataTypes={false}
                    displayObjectSize={false}
                    enableClipboard={true}
                    collapsed={2}
                    style={{ backgroundColor: 'transparent', fontSize: '0.875rem' }}
                  />
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 p-8 text-center">
                <Terminal className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Click "Send Request" to see the response</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
