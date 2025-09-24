import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { GenomeAssemblyFromSearch } from "~/lib/type";
import { getAvailableGenomes } from "~/utils/genome-api";

interface GenomeSelectorProps {
    selectedGenome: string
    onSelectGenome: (genome: string) => void
}

const GenomeSelector = ({ selectedGenome, onSelectGenome }: GenomeSelectorProps) => {
    const [genomes, setGenomes] = useState<GenomeAssemblyFromSearch[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchGenomes = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const data = await getAvailableGenomes()

                if (data.genomes?.Human) {
                    setGenomes(data.genomes.Human)
                }
            } catch {  // ← Eliminar _error aquí
                setError('Failed to load genomes')
            } finally {
                setIsLoading(false)
            }
        }

        void fetchGenomes()
    }, [])

    const handleGenomesChange = (value: string) => {
        onSelectGenome(value)
    }

    if (error) return <p className="text-red-500">{error}</p>

    return (
        <div>
            <Select
                value={selectedGenome}
                onValueChange={handleGenomesChange}
                disabled={isLoading}
            >
                <SelectTrigger className="h-9 w-full border-[#3c4f3d]/10">
                    <SelectValue placeholder='Select Genome Assembly' />
                </SelectTrigger>

                <SelectContent>
                    {genomes.map((genome) => (
                        <SelectItem
                            key={genome.id}
                            value={genome.id}
                        >
                            {genome.id} - {genome.name}
                            {genome.active ? ' (active)' : ''}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {selectedGenome && (
                <p className="mt-2 text-xs text-[#3c4f3d]/60">
                    {
                        genomes.find((genome) => genome.id === selectedGenome)?.sourceName
                    }
                </p>
            )}
        </div>
    )
}

export default GenomeSelector