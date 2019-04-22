(
    trap 'check-error $LINENO' ERR
    app_name=$( pwd )
    app_name=${app_name##*/}
    cd client
    ionic build --prod -- --base-href /$app_name/
    rm -rf $HOME_PATH/SEOHASONG/seohasong.github.io/$app_name
    mv www $HOME_PATH/SEOHASONG/seohasong.github.io/$app_name
    cd ..
    gitgit
    cd $HOME_PATH/SEOHASONG/seohasong.github.io
    gitgit
    seohasong
    gitgit
)
