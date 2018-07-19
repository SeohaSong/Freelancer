curl -o cifar-10-python.tar.gz \
https://www.cs.toronto.edu/~kriz/cifar-10-python.tar.gz
tar -xvf cifar-10-python.tar.gz
mv cifar-10-batches-py data
rm -rf cifar-10-python.tar.gz