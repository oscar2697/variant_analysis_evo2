export interface GenomeAssemblyFromSearch {
    id: string
    name: string
    sourceName: string
    active: boolean
}

export interface ChromosomeFromSearch {
    name: string
    size: number
}

export interface GeneFromSearch {
    symbol: string
    name: string
    chrom: string
    description: string
    gene_id?: string
}

export interface GeneDetailsFromSearch {
    genomicinfo?: {
        chrstart: number
        chrstop: number
        strand?: string
    }[]

    summary?: string
    organism?: {
        scientificname: string
        commonname: string
    }
}

export interface GeneBounds {
    min: number
    max: number
}

export interface ClinvarVariant {
    clinvar_id: string
    title: string
    variation_type: string
    classification: string
    gene_sort: string
    chromosome: string
    location: string
    evo2Result?: {
        prediction: string
        delta_score: number
        classification_confidence: number
    }
    isAnalyzing?: boolean
    evo2Error: string | null
}

export interface AnalysisResult {
    position: number;
    reference: string;
    alternative: string;
    delta_score: number;
    prediction: string;
    classification_confidence: number;
}

export interface UCSCGenomeResponse {
    ucscGenomes: Record<string, {
        organism?: string
        description?: string
        sourceName?: string
        active?: boolean
    }>
}

export interface UCSCChromosomeResponse {
    chromosomes: Record<string, number>
}

export interface NCBIGeneResponse {
    [0]: number 
    [1]: unknown
    [2]: { GeneID?: string[] } 
    [3]: string[][] 
}

export interface NCBIGeneDetailsResponse {
    result?: Record<string, GeneDetailsFromSearch>
}

export interface UCSCSequenceResponse {
    dna?: string
    error?: string
}

export interface ClinvarSearchResponse {
    esearchresult?: {
        idlist?: string[]
    }
}

export interface ClinvarSummaryResponse {
    result?: {
        uids?: string[]
    } & Record<string, {
        title?: string
        obj_type?: string
        germline_classification?: {
            description?: string
        }
        gene_sort?: string
        location_sort?: string
        evo2Error?: string | null
    }>
}