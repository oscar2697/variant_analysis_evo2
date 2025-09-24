import { useEffect, useState } from "react";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { ChromosomeFromSearch, GeneFromSearch } from "~/lib/type";
import { getGenomeChromosomes, searchGenes } from "~/utils/genome-api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface ChromosomeSelectorProps {
    selectgenome: string
    selectedChromosome: string
    onSelectChromosome: (value: string) => void
    searchResults: GeneFromSearch[]
    setSearchResults: (results: GeneFromSearch[]) => void
    selectedGenes: GeneFromSearch | null
    setSelectedGenes: (gene: GeneFromSearch | null) => void
}

type Mode = 'browse' | 'search'

const ChromosomeSelector = (
    {
        selectgenome,
        selectedChromosome,
        onSelectChromosome,
        searchResults,
        setSearchResults,
        selectedGenes,
        setSelectedGenes
    }: ChromosomeSelectorProps) => {
    const [chromosomes, setChromosomes] = useState<ChromosomeFromSearch[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mode, setMode] = useState<Mode>('search')

    useEffect(() => {
        const fetchChromosomes = async () => {
            try {
                setIsLoading(true)
                const data = await getGenomeChromosomes(selectgenome)
                setChromosomes(data.chromosomes)

                if (data.chromosomes.length > 0) {
                    onSelectChromosome(data.chromosomes[0]!.name);
                }
            } catch (error) {
                setError('Failed to load genomes')
            } finally {
                setIsLoading(false)
            }
        }

        fetchChromosomes()
    }, [selectgenome])

    useEffect(() => {
        if (!selectedChromosome || mode != 'browse') return

        performGeneSearch(
            selectedChromosome,
            selectgenome,

            (gene: GeneFromSearch) => gene.chrom === selectedChromosome
        )
    }, [selectedChromosome, selectgenome, mode])

    const performGeneSearch = async (query: string, genome: string, filterFn?: (gene: GeneFromSearch) => boolean) => {
        try {
            setIsLoading(true)

            const data = await searchGenes(query, genome)
            const results = filterFn ? data.results.filter(filterFn) : data.results

            setSearchResults(results)
        } catch (error) {
            setError('Field to Search genes')
        } finally {
            setIsLoading(false)
        }
    }

    const switchMode = (newMode: Mode) => {
        if (newMode === mode) return

        setSearchResults([])
        setSelectedGenes(null)
        setError(null)

        if (newMode === 'browse' && selectedChromosome) {
            performGeneSearch(
                selectedChromosome,
                selectgenome,

                (gene: GeneFromSearch) => gene.chrom === selectedChromosome
            )
        }

        setMode(newMode)
    }

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!searchQuery.trim()) return

        performGeneSearch(searchQuery, selectgenome)
    }

    const loadBRCA1Example = () => {
        setMode('search')
        setSearchQuery('BRCA1')
        performGeneSearch('BRCA1', selectgenome)
    }

    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div>
            <CardHeader className="pt-4 pb-2">
                <CardTitle className="text-sm font-normal text-[#3c4f3d]/70">Browse</CardTitle>
            </CardHeader>

            <CardContent className="pb-4">
                <Tabs
                    value={mode}
                    onValueChange={(value) => switchMode(value as Mode)}
                >
                    <TabsList className="mb-4 bg-[#e9eeea]">
                        <TabsTrigger
                            className="data-[state=active]:bg-white data-[state=active]:text-[#3c4f3d]"
                            value="search"
                        >
                            Search Genes
                        </TabsTrigger>

                        <TabsTrigger
                            className="data-[state=active]:bg-white data-[state=active]:text-[#3c4f3d]"
                            value="browse"
                        >
                            Browse Chromosomes
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="search"
                        className="mt-0"
                    >
                        <div className="space-y-4">
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col gap-3 sm:flex-row"
                            >
                                <div className="relative flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Enter the Gene symbol or Name"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-9 border-[#3c4f3d]/10 pr-10"
                                    />

                                    <Button
                                        type="submit"
                                        size='icon'
                                        className="absolute top-0 right-0 h-full cursor-pointer rounded-l-none bg-[#3c4f3d] text-white hover:bg-[#3c4f3d]/90"
                                        disabled={isLoading || !searchQuery.trim()}
                                    >
                                        <Search className="h-4 w-4" />
                                        <span className="sr-only">Search</span>
                                    </Button>
                                </div>
                            </form>

                            <Button
                                variant='link'
                                className="h-auto cursor-pointer p-0 text-[#de8246] hover:text-[#de8246]/80"
                                onClick={loadBRCA1Example}
                            >
                                Try BRCA1 Example
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="browse"
                        className="mt-0"
                    >
                        <div className="max-h-[150px] overflow-y-auto pr-1">
                            <div className="flex flex-wrap gap-2">
                                {chromosomes.map((chrom) => (
                                    <Button
                                        key={chrom.name}
                                        variant='outline'
                                        size='sm'
                                        className={`h-8 cursor-pointer border-[#3c4f3d]/10 hover:bg-[#e9eeea] hover:text-[#3c4f3d] ${selectedChromosome === chrom.name ? 'bg-[#e9eeea] text-[#3c4f3d]' : ''}`}
                                        onClick={() => onSelectChromosome(chrom.name)}
                                    >
                                        {chrom.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {isLoading && (
                    <div className="flex justify-center py-4">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#3c4f3d]/30 border-t-[#de8246]"></div >
                    </div>
                )}

                {error && (
                    <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {searchResults.length > 0 && !isLoading && (
                    <div className="mt-6">
                        <div className="mb-2">
                            <h4 className="text-xs font-normal text-[#3c4f3d]/70">
                                {mode === 'search' ? (
                                    <>
                                        Search Results: {' '}
                                        <span className="font-medium text-[#3c4f3d]">
                                            {searchResults.length} genes
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Genes On {selectedChromosome}: {' '}
                                        <span className="font-medium text-[#3c4f3d]">
                                            {searchResults.length} found
                                        </span>
                                    </>
                                )}
                            </h4>
                        </div>

                        <div className="overflow-hidden rounded-md border border-[#3c4f3d]/50">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#e9eeea]/50 hover:bg-[#e9eeea/70]">
                                        <TableHead className="text-xs font-normal text-[#3c4f3d]/70">Symbol</TableHead>
                                        <TableHead className="text-xs font-normal text-[#3c4f3d]/70">Name</TableHead>
                                        <TableHead className="text-xs font-normal text-[#3c4f3d]/70">Location</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {searchResults.map((gene, index) => (
                                        <TableRow
                                            key={`${gene.symbol} - ${index}`}
                                            className="cursor-pointer border-b border-[#3c4f3d]/5 hover:bg-[#e9eeea]/50"
                                            onClick={() => setSelectedGenes(gene)}
                                        >
                                            <TableCell className="py-2 font-medium text-[#3c4f3d]">{gene.symbol} </TableCell>
                                            <TableCell className="py-2 font-medium text-[#3c4f3d]">{gene.name} </TableCell>
                                            <TableCell className="py-2 font-medium text-[#3c4f3d]">{gene.chrom} </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {!isLoading && !error && searchResults.length === 0 && (
                    <div className="flex h-48 flex-col items-center justify-center text-center text-gray-400">
                        <Search className="mb-4 h-10 w-10 text-gray-400" />

                        <p className="text-sm leading-relaxed">
                            {
                                mode === 'search' ? 'Enter a Gene or a Symbol to Search'
                                    : selectedChromosome ? 'No Genes found on this Chromosome'
                                        : 'Select a Chromosome to view the Genes'
                            }
                        </p>
                    </div>
                )}
            </CardContent>
        </div>
    )
}

export default ChromosomeSelector