import numpy as np
from numpy import r_, c_
import os
from os import path
import pandas as pd


from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import f1_score, recall_score, precision_score
from sklearn.metrics import accuracy_score, confusion_matrix, roc_auc_score


def get_data_paths():
    
    def get_train_and_test_path(*args):
        path_ = DB_PATH("data", *args)
        train_path = path.join(path_, "Train_data.csv")
        test_path = path.join(path_, "Test_data.csv")
        return train_path, test_path
    
    bank_types = ["Bank", "SBank"]
    timesteps = ["TimeStep_%d" % i for i in range(1, 5)]
    data_indices = ["data%02d" % i for i in range(1, 31)]
    
    argss = [[bank_type, timestep, data_index]
             for bank_type in bank_types
             for timestep in timesteps
             for data_index in data_indices]
    
    train_and_test_path = [get_train_and_test_path(*args) for args in argss
                           if path.isdir(DB_PATH("data", *args))]
    
    return train_and_test_path


def get_data(train_path, test_path):
    
    train_data = pd.read_csv(train_path, index_col=None, encoding="cp949", thousands=",")
    test_data = pd.read_csv(test_path, index_col=None, encoding="cp949", thousands=",")

    train_X = train_data.iloc[:,1:]
    train_y = train_data["Target"]
    test_X = test_data.iloc[:,1:]
    test_y = test_data["Target"]
    
    return train_X, train_y, test_X, test_y


def get_result_df(train_X, train_y, test_X, test_y):
    
    def rum_model(model, model_name):
        SS = StandardScaler()
        sclaled_X = SS.fit_transform(train_X)
        fitted_model = model.fit(sclaled_X, train_y)
        scaled_test_X = SS.transform(test_X)
        pred_y = fitted_model.predict(scaled_test_X)
        prob_y = fitted_model.predict_proba(scaled_test_X)
        result = list(zip(pred_y, prob_y[:,1]))
        result_df = pd.DataFrame(result, columns=["%s_pred" % model_name, "%s_prob" % model_name])
        return result_df
        
    LR = LogisticRegression(class_weight="balanced")
    RF = RandomForestClassifier(n_estimators=1000, max_features=100)

    df = pd.DataFrame(test_y.tolist(), columns=["Y_true"])
    LR_df = pd.concat([df, rum_model(LR, "LR")], axis=1)
    RF_df = pd.concat([df, rum_model(RF, "RF")], axis=1)

    return LR_df, RF_df


def save_result_dfs(result_df_pair, data_path):
    
    data_path = data_path[0]
    data_path = data_path.replace(DB_PATH("data"), DB_PATH("result"))
    
    for i, model_name in enumerate(["LR", "RF"]):
        file_dir, filename = path.split(path.dirname(data_path))
        file_dir = path.join(file_dir, model_name)
        filename = filename + ".pickle"
        save_path = path.join(file_dir, filename)
        if not path.isdir(file_dir):
            os.makedirs(file_dir)
        result_df_pair[i].to_pickle(save_path)


def make_report_df():
    
    def summarize(filepath):
        result_df = pd.read_pickle(filepath)
        test_y = result_df["Y_true"]
        pred_y = result_df.iloc[:,1]
        f1 = f1_score(test_y, pred_y)
        recall = recall_score(test_y, pred_y)
        precision = precision_score(test_y, pred_y)
        accuracy = accuracy_score(test_y, pred_y)
        cm = confusion_matrix(test_y, pred_y)
        specificity = cm[0, 0] / np.sum(cm[0, :])
        bcr = np.sqrt(recall * specificity)
        auroc = roc_auc_score(test_y, pred_y)
        return [accuracy, precision, recall, f1, bcr, auroc]
    
    bank_types = ["Bank", "SBank"]
    timesteps = ["TimeStep_%d" % i for i in range(1, 5)]
    model_names = ["LR", "RF"]
    
    argss = [[bank_type, timestep, model_name]
             for bank_type in bank_types
             for timestep in timesteps
             for model_name in model_names
             if path.isdir(DB_PATH("result", bank_type, timestep, model_name))]
    
    cols = ['Accuracy', 'Accuracy_std', 'Precision', 'Precision_std',
            'Recall', 'Recall_std', 'F1', 'F1_std', 'BCR','BCR_std', 'AUROC', 'AUROC_std']
    summary_df = pd.DataFrame(columns=range(len(cols)))
    
    for args in argss:
        path_ = DB_PATH("result", *args)
        filepaths = [path.join(path_, filename) for filename in os.listdir(path_)]
        summarys = [summarize(filepath) for filepath in filepaths]
        summary_mean = r_[summarys].mean(0)
        summary_std = r_[summarys].std(0)
        summary = c_[summary_mean, summary_std].round(4).ravel()
        summary_df = pd.concat([summary_df, pd.DataFrame([summary])])
        
    summary_df = summary_df.reset_index(drop=True)
    summary_df.columns = cols
    report_df = pd.DataFrame(argss, columns=["bank", "time", "model"])
    
    report_df = pd.concat([report_df, summary_df], axis=1)    
    report_df.to_pickle(DB_PATH("report_df.pickle"))


if __name__ == "__main__":

    def DB_PATH(*args):
        return path.join("./DB/model/", *args)

    if not path.isdir(DB_PATH("result")):
        data_paths = get_data_paths()
        for data_path in data_paths:
            data = get_data(*data_path)
            result_df_pair = get_result_df(*data)
            save_result_dfs(result_df_pair, data_path)

    if not path.isdir(DB_PATH("report")):
        make_report_df()