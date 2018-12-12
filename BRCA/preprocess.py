import os

from tools.preprocessor import Processor


main_dir_path = os.path.dirname(__file__)


if __name__ == "__main__":
    
    key2path = {
        'picked': 'data/BRCA.clin.merged.picked.txt',
        'rna-hi': 'data/BRCA.rnaseqv2__illuminahiseq_rnaseqv2__unc_edu__Level_3__RSEM_genes_normalized__data.data.txt',
        'mirna-hi': 'data/BRCA.mirnaseq__illuminaga_mirnaseq__bcgsc_ca__Level_3__miR_gene_expression__data.data.txt',
        'miran-ga': 'data/BRCA.mirnaseq__illuminahiseq_mirnaseq__bcgsc_ca__Level_3__miR_gene_expression__data.data.txt'
    }

    for k in key2path:
        key2path[k] = os.path.join(main_dir_path, key2path[k])

    proc = Processor(key2path)
    
    for tumor_type in proc.partial_tumor_types:
        df = proc.get_partial_table(tumor_type)
        relative_path = 'data/partial-%s.csv' % tumor_type
        filepath = os.path.join(main_dir_path, relative_path)
        print('Saving %s ...' % filepath)
        df.to_csv(filepath, index=False)

    for tumor_type in proc.full_tumor_types:
        df = proc.get_full_table(tumor_type)
        relative_path = 'data/full-%s.csv' % tumor_type
        filepath = os.path.join(main_dir_path, relative_path)
        print('Saving %s ...' % filepath)
        df.to_csv(filepath, index=False)

    print('Process completed.')
