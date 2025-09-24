import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import GenomeSelector from "./GenomeSelector";
import ChromosomeSelector from "./ChromosomeSelector";
import type { GeneFromSearch } from "~/lib/type";
import GeneViewer from "./gene-viewer";

const SelectHeader = () => {
    const [selectedGenome, setSelectedGenome] = useState("hg38")
    const [selectedChromosome, setSelectedChromosome] = useState("chr1")
    const [searchResults, setSearchResults] = useState<GeneFromSearch[]>([])
    const [selectedGenes, setSelectedGenes] = useState<GeneFromSearch | null>(null)

    const handleGenomeChange = (value: string) => {
        setSelectedGenome(value)
        setSearchResults([])
        setSelectedGenes(null)
    }

    return (
        <main className="container mx-auto px-6 py-6">
            {selectedGenes ? (
                <GeneViewer 
                    gene={selectedGenes}
                    genomeId={selectedGenome}
                    onClose={() => setSelectedGenes(null)}
                />
            ) : (
                <>
                    <Card className="mb-6 gap-0 border-none bg-white py-0 shadow-sm">
                        <CardHeader className="pt-4 pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-normal text-[#3c4f3d]/70">Genome Assembly</CardTitle>

                                <div className="text-xs text-[#3c4f3d]/60">
                                    Organism: <span className="font-medium">Human</span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pb-4">
                            <GenomeSelector
                                selectedGenome={selectedGenome}
                                onSelectGenome={handleGenomeChange}
                            />

                        </CardContent>
                    </Card>

                    <Card className="mt-6 gap-0 border-none bg-white py-0 shadow-sm">
                        <CardContent className="pb-4">
                            <ChromosomeSelector
                                selectgenome={selectedGenome}
                                selectedChromosome={selectedChromosome}
                                onSelectChromosome={setSelectedChromosome}
                                searchResults={searchResults}
                                setSearchResults={setSearchResults}
                                selectedGenes={selectedGenes}
                                setSelectedGenes={setSelectedGenes}
                            />
                        </CardContent>
                    </Card>
                </>
            )}
        </main>
    )
}

export default SelectHeader