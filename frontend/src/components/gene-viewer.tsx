'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ClinvarVariant, GeneBounds, GeneDetailsFromSearch, GeneFromSearch } from '~/lib/type'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { fetchGeneDetails, fetchGeneSequence as apifetchGeneSequence, fetchClinvarVariants } from '~/utils/genome-api'
import GeneInformation from './gene-information'
import GeneSequence from './gene-sequence'
import KnownVariants from './known-variants'
import VariantComparisonModal from './variant-comparison-modal'
import VariantAnalysis, { type VariantAnalysisHandle } from './variant-analysis'

const GeneViewer = ({ gene, genomeId, onClose }: { gene: GeneFromSearch, genomeId: string, onClose: () => void }) => {
    const [geneBounds, setGeneBounds] = useState<GeneBounds | null>(null)
    const [geneSequence, setGeneSequence] = useState('')
    const [geneDetail, setGeneDetail] = useState<GeneDetailsFromSearch | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [startPosition, setStartPsition] = useState<string>('')
    const [endPosition, setEndPsition] = useState<string>('')
    const [isLoadingSequence, setIsLoadingSequence] = useState(false)
    const [actualRange, setActualRange] = useState<{ start: number; end: number } | null>(null)
    const [clinvarVariants, setClinvarVariants] = useState<ClinvarVariant[]>([])
    const [isLoadingClinvarVariants, setIsLoadingClinvarVariants] = useState(false)
    const [clinvarError, setClinvarError] = useState<string | null>(null)
    const [comparisonVariant, setComparisonVariant] = useState<ClinvarVariant | null>(null)
    const [activeSequencePosition, setSequencePosition] = useState<number | null>(null)
    const [activeReferenceNucleotide, setActiveReferenceNucleotide] = useState<string | null>(null)

    const variantAnalysisRef = useRef<VariantAnalysisHandle>(null)

    const updateClinvarVariant = (clinvar_id: string, updateVariant: ClinvarVariant) => {
        setClinvarVariants((currentVariants) => currentVariants.map((v) => v.clinvar_id == clinvar_id ? updateVariant : v))
    }

    const fetchGeneSequence = useCallback(async (start: number, end: number) => {
        try {
            setIsLoadingSequence(true)
            setError(null)

            const { sequence, actualRange: fetchedRange, error: apiError } = await apifetchGeneSequence(gene.chrom, start, end, genomeId)

            setGeneSequence(sequence)
            setActualRange(fetchedRange)

            if (apiError) {
                setError(apiError)
            }
        } catch { // ← Corregido: eliminar _error
            setError('Failed to Load the Sequence Data') // ← También corregí "Faild" a "Failed"
        } finally {
            setIsLoadingSequence(false)
        }
    },
        [gene.chrom, genomeId]
    )

    useEffect(() => {
        const initializeGeneData = async () => {
            setIsLoading(true)
            setError(null)
            setGeneDetail(null)
            setStartPsition('')
            setEndPsition('')

            if (!gene.gene_id) {
                setError('Gene ID missing')
                setIsLoading(false)
                return
            }

            try {
                const { geneDetails: fetchedDetails, geneBounds: fetchedBounds, initialRange: fetchedRange } = await fetchGeneDetails(gene.gene_id)

                setGeneDetail(fetchedDetails)
                setGeneBounds(fetchedBounds)

                if (fetchedRange) {
                    setStartPsition(String(fetchedRange.start))
                    setEndPsition(String(fetchedRange.end))

                    void fetchGeneSequence(fetchedRange.start, fetchedRange.end) 
                }
            } catch { // ← Corregido: eliminar _error
                setError('Failed to load Gene Information') // ← También corregí "Informatoin" a "Information"
            } finally {
                setIsLoading(false)
            }
        }

        void initializeGeneData()
    }, [gene, genomeId, fetchGeneSequence])

    const handleSequenceClick = useCallback(
        (position: number, nucleotide: string) => {
            setSequencePosition(position)
            setActiveReferenceNucleotide(nucleotide)
            window.scrollTo({ top: 0, behavior: "smooth" })
            if (variantAnalysisRef.current) {
                variantAnalysisRef.current.focusAlternativeInput()
            }
        },
        [],
    )

    const handleLoadSequence = useCallback(() => {
        const start = parseInt(startPosition)
        const end = parseInt(endPosition)

        let validateError: string | null = null

        if (isNaN(start) || isNaN(end)) {
            validateError = 'Enter a valid Start or End Position'
        } else if (start >= end) {
            validateError = 'Start Position must be less than end Position'
        } else if (geneBounds) {
            const minBound = Math.min(geneBounds.min, geneBounds.max)
            const maxBound = Math.max(geneBounds.min, geneBounds.max)

            if (start < minBound) {
                validateError = `Start Position (${start.toLocaleString()}) is below the minimum value (${minBound.toLocaleString()})`
            } else if (end > maxBound) {
                validateError = `End Position (${end.toLocaleString()}) exceeds the maximum value (${maxBound.toLocaleString()})`
            }

            if (end - start > 10000) {
                validateError = 'Selected Range exceeds maximum view Range of 10.000 bp.'
            }
        }

        if (validateError) {
            setError(validateError)
            return
        }

        setError(null)
        void fetchGeneSequence(start, end) 
    }, [startPosition, endPosition, fetchGeneSequence, geneBounds])

    const fetchClinvar = useCallback(async () => {
        if (!gene.chrom || !geneBounds) return

        setIsLoadingClinvarVariants(true)
        setClinvarError(null)

        try {
            const variants = await fetchClinvarVariants(
                gene.chrom,
                geneBounds,
                genomeId
            )

            setClinvarVariants(variants)
        } catch { // ← Corregido: eliminar _error
            setClinvarError('Something Happened while Fetching the ClinVar Variants') // ← Mensaje mejorado
            setClinvarVariants([])
        } finally {
            setIsLoadingClinvarVariants(false)
        }
    }, [gene.chrom, geneBounds, genomeId]) 

    useEffect(() => {
        if (geneBounds) {
            void fetchClinvar() 
        }
    }, [geneBounds, fetchClinvar]) 

    const showComparisonVariant = (variant: ClinvarVariant) => {
        if (variant.evo2Result) {
            setComparisonVariant(variant)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800"></div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <Button
                variant='ghost'
                size='sm'
                className='cursor-pointer text-[#3c4f3d] hover:bg-[#e9eeea]/70'
                onClick={onClose}
            >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Results
            </Button>

            <VariantAnalysis
                ref={variantAnalysisRef}
                gene={gene}
                genomeId={genomeId}
                chromosome={gene.chrom}
                clinvarVariants={clinvarVariants}
                referenceSequence={activeReferenceNucleotide}
                sequencePosition={activeSequencePosition}
                geneBounds={geneBounds}
            />

            <KnownVariants
                refreshVariants={fetchClinvar}
                showComparison={showComparisonVariant}
                updateClinvarVariants={updateClinvarVariant}
                clinvarVariants={clinvarVariants}
                isLoadingClinvar={isLoadingClinvarVariants}
                clinvarError={clinvarError}
                genomeId={genomeId}
                gene={gene}
            />

            <GeneSequence
                geneBounds={geneBounds}
                geneDetail={geneDetail}
                startPosition={startPosition}
                endPosition={endPosition}
                onStartPositionChange={setStartPsition}
                onEndPositionChange={setEndPsition}
                sequenceData={geneSequence}
                sequenceRange={actualRange}
                isLoading={isLoadingSequence}
                error={error}
                onSequenceLoadRequest={handleLoadSequence}
                onSequenceClick={handleSequenceClick}
                maxViewRage={10000}
            />

            <GeneInformation
                gene={gene}
                geneDetail={geneDetail}
                geneBounds={geneBounds}
            />

            <VariantComparisonModal
                comparisonVariant={comparisonVariant}
                onClose={() => setComparisonVariant(null)}
            />
        </div>
    )
}

export default GeneViewer