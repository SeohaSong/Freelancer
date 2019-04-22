(
    trap 'check-error $LINENO' ERR
    
    module=$1
    dir_path=$( dirname $BASH_SOURCE )/init
    modules=$( ls $dir_path )
    [ "$( echo "$modules" | grep "^$module$" )" == "" ] && echo "$modules" || {
        . $dir_path/$module/init.sh $( echo $@ | cut -d " " -f 2- )
    }
)
