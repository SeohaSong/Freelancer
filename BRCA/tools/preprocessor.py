import pandas as pd


class Processor():

    def __init__(self, key2path, partial_table=False):

        df1 = self._get_df1(key2path['picked'])
        type2df = self._get_df2(key2path['rna-hi'])

        self._df1 = df1
        self._type2df = type2df
        self.partial_tumor_types = sorted(type2df)

        if partial_table:
            del self.get_full_table
        else:
            type2mihi_df = self._get_mi_df(key2path['mirna-hi'])
            type2miga_df = self._get_mi_df(key2path['miran-ga'])
            self._type2mihi_df = type2mihi_df
            self._type2miga_df = type2miga_df
            
            types = set(type2df)&set(type2mihi_df)&set(type2miga_df)
            self.full_tumor_types = sorted(types)


    def _get_df1(self, filepath):
        
        print('Processing %s ...' % filepath)

        df = pd.read_table(filepath, sep='\t', header=None, index_col=0)

        df = df.T
        df.insert(0, 'patientID', [s.upper() for s in df['Hybridization REF']])

        df = df.drop('Hybridization REF', axis=1)
        
        return df


    def _get_df2(self, filepath):
        
        print('Processing %s ...' % filepath)

        df = pd.read_table(filepath, sep='\t', low_memory=False)
        df = df.drop(0)

        df = df.T
        df.columns = [s.split('|')[0] for s in df.loc['Hybridization REF']]
        df = df.drop('Hybridization REF')
        
        df.insert(0, 'tumorType', [s[13:16] for s in df.index])
        df.insert(0, 'patientID', [s[0:12] for s in df.index])
        df = df.reset_index(drop=True)

        type2df = {k: v for k, v in df.groupby('tumorType')}

        return type2df


    def _get_mi_df(self, filepath):
        
        print('Processing %s ...' % filepath)
    
        df = pd.read_table(filepath, sep='\t', low_memory=False)

        meta = list(df.iloc[0][1:4])
        df = df.drop(0)

        refs = df['Hybridization REF']
        df = df.drop('Hybridization REF', axis=1)

        dfs = []
        for i in range(3):
            cidxs = [i_ for i_ in range(len(df.columns)) if i_%3 == i]
            df_ = df.iloc[:, cidxs]
            df_.index = ['.'.join([s, meta[i]]) for s in refs]
            df_.columns = [s.split('.')[0] for s in df_.columns]
            dfs.append(df_)
        df = pd.concat(dfs)

        df = df.T

        set_n = len(df.columns)//3
        cidxs = sum(
            [[set_n*i_+i for i_ in range(3)] for i in range(set_n)],
            []
        )
        df = df.iloc[:, cidxs]

        df.insert(0, 'tumorType', [s[13:16] for s in df.index])
        df.insert(0, 'patientID', [s[0:12] for s in df.index])
        df.index = df['patientID']
        
        type2df = {k: v for k, v in df.groupby('tumorType')}
        
        return type2df


    def get_partial_table(self, tumor_type):

        df1 = self._df1
        df2 = self._type2df[tumor_type]

        print('Merging ... (%s partial)' % tumor_type)
        
        df = pd.merge(df1, df2, how='right', on='patientID')
        
        return df


    def get_full_table(self, tumor_type):

        df1 = self._df1
        df2 = self._type2df[tumor_type]
        df3 = self._type2mihi_df[tumor_type]
        df4 = self._type2miga_df[tumor_type]

        print('Merging ... (%s full)' % tumor_type)
        
        df4 = df4.loc[list(set(df4.index)-set(df3.index))]
        df34 = df3.append(df4).reset_index(drop=True)
        df34 = df34.drop('tumorType', axis=1)

        df = pd.merge(df1, df2, how='right', on='patientID')
        df = pd.merge(df, df34, how='right', on='patientID')
        
        return df


