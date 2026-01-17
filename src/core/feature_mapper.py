def build_feature_vector(patient_data, feature_order, default=0):
    """
    Converts unified patient data into a model-ready feature vector.

    patient_data : dict
        Unified patient schema dictionary
    feature_order : list
        List of feature names in the exact order expected by the model
    default : any
        Value to use if a feature is missing
    """
    return [patient_data.get(feature, default) for feature in feature_order]
