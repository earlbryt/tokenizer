"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowRight, Code, FileText, Zap, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import TokenVisualizer from "@/components/token-visualizer"
import { tokenize, checkHealth } from "@/lib/api"

export default function TokenizerPage() {
  const [inputText, setInputText] = useState("")
  const [tokens, setTokens] = useState<number[]>([])
  const [decodedText, setDecodedText] = useState("")
  const [tokenMappings, setTokenMappings] = useState<Array<{ id: number; text: string }>>([])
  const [stats, setStats] = useState({
    originalSize: 0,
    tokenCount: 0,
    compressionRatio: 0,
    matches: false
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [apiAvailable, setApiAvailable] = useState(false)
  const [isBannerVisible, setIsBannerVisible] = useState(true)
  
  // Add ref for scrolling to visualization
  const visualizerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if the API is available when the component mounts
    const checkApiHealth = async () => {
      try {
        const health = await checkHealth()
        setApiAvailable(health.status === "OK")
      } catch (error) {
        console.error("API health check failed:", error)
        setApiAvailable(false)
        setErrorMessage("Cannot connect to API server. Make sure it is running.")
      }
    }

    checkApiHealth()
  }, [])

  const handleEncode = async () => {
    if (!inputText.trim()) {
      setErrorMessage("Please enter some text to encode")
      return
    }

    setIsProcessing(true)
    setErrorMessage("")

    try {
      const result = await tokenize(inputText)
      setTokens(result.tokens)
      setDecodedText(result.decoded)
      setTokenMappings(result.tokenMappings || [])
      setStats({
        originalSize: result.stats.originalSize,
        tokenCount: result.stats.tokenCount,
        compressionRatio: result.stats.compressionRatio,
        matches: result.stats.matches
      })
      
      // Scroll to visualizer after state updates and rendering
      setTimeout(() => {
        if (visualizerRef.current) {
          visualizerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } catch (error) {
      console.error("Error encoding text:", error)
      setErrorMessage("Error processing your text. Check that the API server is running.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setInputText("")
    setTokens([])
    setDecodedText("")
    setTokenMappings([])
    setStats({
      originalSize: 0,
      tokenCount: 0,
      compressionRatio: 0,
      matches: false
    })
    setErrorMessage("")
  }

  const refreshApi = async () => {
    setIsBannerVisible(true)
    try {
      const health = await checkHealth()
      setApiAvailable(health.status === "OK")
    } catch (error) {
      console.error("API health check failed:", error)
      setApiAvailable(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {isBannerVisible && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 py-2 px-4 text-sm text-amber-800 dark:text-amber-300 relative">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <p>
                {apiAvailable 
                  ? "If you encounter issues, try refreshing the page."
                  : "API server may be in sleep mode. Please wait a moment and try again."}
              </p>
              <button 
                onClick={refreshApi}
                className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
                aria-label="Refresh API connection"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            <button 
              onClick={() => setIsBannerVisible(false)} 
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Byte Pair Encoding Tokenizer</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              
            </p>
          </div>

          <Card className="border-slate-200 shadow-md dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Input Text
              </CardTitle>
              <CardDescription>Enter the text you want to tokenize using the BPE algorithm</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter text to tokenize..."
                className="min-h-[150px] resize-none font-mono text-sm"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              {errorMessage && (
                <div className="mt-2 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
              <Button variant="outline" onClick={handleClear} disabled={isProcessing || !inputText}>
                Clear
              </Button>
              <Button 
                onClick={handleEncode} 
                disabled={isProcessing || !inputText.trim() || !apiAvailable} 
                className="gap-2"
              >
                {isProcessing ? "Processing..." : "Encode"}
                {!isProcessing && <ArrowRight className="h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>

          {tokens.length > 0 && (
            <div ref={visualizerRef}>
              <TokenVisualizer 
                text={inputText} 
                tokens={tokens} 
                decoded={decodedText}
                tokenMappings={tokenMappings}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-md dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Tokens
                </CardTitle>
                <CardDescription>Generated tokens from the input text</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 min-h-[150px] font-mono text-sm overflow-auto">
                  {tokens.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tokens.map((token, index) => (
                        <span key={index} className="inline-block bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-md">
                          {token}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center h-full flex items-center justify-center">
                      {inputText ? "Encode to see tokens" : "No tokens generated yet"}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">{stats.tokenCount} tokens</div>
              </CardFooter>
            </Card>

            <Card className="border-slate-200 shadow-md dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Decoded Text
                </CardTitle>
                <CardDescription>Text reconstructed from the tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 min-h-[150px] font-mono text-sm overflow-auto">
                  {decodedText ? (
                    <p>{decodedText}</p>
                  ) : (
                    <div className="text-muted-foreground text-center h-full flex items-center justify-center">
                      No decoded text yet
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  {decodedText ? `${decodedText.length} characters` : "-"}
                  {stats.matches ? (
                    <span className="text-green-500 ml-2">✓ Perfect match</span>
                  ) : decodedText ? (
                    <span className="text-red-500 ml-2">⚠ Decoding mismatch</span>
                  ) : null}
                </div>
              </CardFooter>
            </Card>
          </div>

          <Card className="border-slate-200 shadow-md dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Statistics
              </CardTitle>
              <CardDescription>Performance metrics of the BPE tokenization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Original Size" value={stats.originalSize > 0 ? `${stats.originalSize} bytes` : "-"} />
                <StatCard title="Token Count" value={stats.tokenCount > 0 ? `${stats.tokenCount} tokens` : "-"} />
                <StatCard 
                  title="Compression Ratio" 
                  value={stats.compressionRatio > 0 
                    ? `${stats.compressionRatio.toFixed(2)}x` 
                    : "-"} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
} 