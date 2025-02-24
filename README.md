# DEBIE Frontend

DEBIE is a web application developed to demonstrate the by Lauscher et al. (2019) in "A general framework for implicit and explicit debiasing of distributional word vector spaces" (accesible under: http://arxiv.org/abs/1909.06092) introduced bias evaluation methods and debiasing models.

The application offers to evaluate bias specifications with the Embedding Coherence Test (ECT), the Bias Analogy Test (BAT), the Word Embeddings Association Test (WEAT), K-Means++ clustering and by applying a SVM classifier on them.

For debiasing, the General Bias-Direction Debiasing (GBDD) and the Bias Analogy Model are offered, together with compositions formed out of them. The models are trained on augmentations of the bias specifications, retrieved through a semantic postspecialised embedding space.

The used word embeddings are retrieved from databases containing word vector representations pre-trained with different models. There are 4 different databases provided, containing fastText, Skip-Gram, CBOW and GloVe vectors pre-trained on a wikipedia dump.

The "\_blank" files offer an second design for the application. Content-wise, they are equal. 

For using other vector representations, the possibility is offered to upload embedding spaces or to provide the exact vectors together with the bias specification in the request.

The backend is published here: https://github.com/nfriedri/debie-backend

An running instance of the application is accessible under: http://debie.informatik.uni-mannheim.de
