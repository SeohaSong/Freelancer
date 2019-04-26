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
    vals="scope start_url"
    filepath="$app_name/manifest.webmanifest"
    for val in $vals
    do
        sed -i s~'"'$val'": "/"'~'"'$val'": "/'$app_name'/"'~g $filepath
    done
    gitgit
    seohasong
    gitgit
)
