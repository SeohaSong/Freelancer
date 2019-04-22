(
    check-error() {
        line_no=$1
        echo $line_no
        sleep 5
        exit
    }
    trap 'check-error $LINENO' ERR

    module=$1
    [ "$BASH_SOURCE" == "cmd.sh" ] || cd $( dirname $BASH_SOURCE )
    modules=$( ls scripts/cmd )
    [ "$( echo "$modules" | grep "^$module$" )" == "" ] && echo "$modules" || {
        . scripts/cmd/$module/init.sh $( echo $@ | cut -d " " -f 2- )
    }
)
